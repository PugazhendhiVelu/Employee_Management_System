const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const jwt = require('jwt-simple');
const DBConnect = require(path.join(__dirname, 'config', 'DBConnection'));
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

DBConnect();



// Routes
const addemp = require(path.join(__dirname, 'routes', 'addemp'));
const displayemp = require(path.join(__dirname, 'routes', 'displayemp'));
const displayproject = require(path.join(__dirname, 'routes', 'displayproject'));
const editbyid = require(path.join(__dirname, 'routes', 'editbyid'));
const getbyid = require(path.join(__dirname, 'routes', 'getbyid'));
const addproject = require(path.join(__dirname, 'routes', 'addproject'));
const getProject = require(path.join(__dirname, 'routes', 'projectid'));
const editproject = require(path.join(__dirname, 'routes', 'editproject'));


app.use('/addEmployee/', addemp);
app.use('/', displayemp);
app.use('/projects/', displayproject);
app.use('/getEmployee/', getbyid);
app.use('/editEmployee/', editbyid);
app.use('/addProject', addproject);
app.use('/getProject/', getProject);
app.use('/editProject/', editproject);




const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(email, otp) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    if (!accessToken.token) {
      throw new Error('Failed to generate access token');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `Your App Name <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Error sending OTP');
  }
}

// Store OTPs in memory (for demonstration purposes; use a database in production)
let otpStore = {};

app.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP

  // Store OTP in memory with a timestamp
  otpStore[email] = { otp: otp.toString(), timestamp: Date.now() };

  try {
    await sendMail(email, otp);
    res.status(200).send('OTP sent');
  } catch (error) {
    res.status(500).send('Error sending OTP');
  }
});

app.post('/login', (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).send('OTP not requested or expired');
  }

  const { otp: storedOtp, timestamp } = otpStore[email];
  const currentTime = Date.now();

  // Validate OTP expiration (e.g., 5 minutes validity)
  if (currentTime - timestamp > 5 * 60 * 1000) {
    delete otpStore[email]; // Clear expired OTP
    return res.status(400).send('OTP expired');
  }

  if (storedOtp !== otp.toString()) {
    return res.status(400).send('Invalid OTP');
  }

  delete otpStore[email]; // Clear OTP after successful validation

  // Generate JWT token (for demonstration purposes)
  const token = jwt.encode({ email }, process.env.JWT_SECRET, 'HS256');
  console.log(token);
  res.cookie('token', token, {
    maxAge: 60 * 60 * 1000, // 1 hr
    httpOnly: false,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'Lax', // Or 'None' if using cross-site requests
    path:'/',
  });
  
  console.log(res.getHeaders());

  return res.status(200).json({ token });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' }); // Specify the path if needed

  console.log(res.getHeaders());
  return res.status(200).send('Logged out successfully');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});