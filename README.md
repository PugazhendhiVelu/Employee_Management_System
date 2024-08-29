# Employee Management System

The Employee Management System (EMS) is a robust web application designed to streamline the management of employee data within an organization. Built using modern web technologies, this system allows administrators to manage employee details, handle project assignments, and ensure data integrity through secure authentication mechanisms.

## Key Features

- **Employee Data Management:**
  - Add, update, and manage employee records.
  - View detailed employee profiles including personal, educational, and professional information.
  - Manage employment status with options such as Active, Terminated, Resigned, and Retired.

- **Project Management:**
  - Assign employees to projects and track their involvement.
  - View a list of projects an employee is associated with, including project details.

- **Authentication & Authorization:**
  - Secure login using JWT-based authentication.
  - Protected endpoints to prevent unauthorized access.

- **Responsive Design:**
  - User-friendly interface built with React and Material-UI.
  - Optimized for various screen sizes and devices.

## Technologies Used

- **Frontend:**
  - React.js for building the user interface.
  - Material-UI for styling and layout.
  - Axios for making HTTP requests.

- **Backend:**
  - Express.js for server-side logic and routing.
  - MongoDB for data storage with Mongoose for schema management.
  - RESTful APIs for frontend-backend communication.

## Required Software

1. Visual Studio Code
2. Node.js
3. MongoDB

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/PugazhendhiVelu/Employee_Management_System.git
2. **Install Dependencies:**
      Navigate to the frontend directory:
   ```bash
           cd frontend
           npm ci
   ```
     Navigate to the backend directory:
   ```bash
           cd backend
           npm ci
   ```
3.**Configure OAuth:**

Go to Google Cloud Console and create an account.
Set up an OAuth service by enabling the Gmail API.
Use your email ID to send OTP and set the authorized email IDs.
Replace the tokens in backend/config/config.env with your OAuth credentials.
4.**Run the application:**
frontend>
```bash
npm run dev
```
backend>
```bash
npm start
```
5.**Access the Application:**
Open your browser and navigate to http://localhost:5173 to use the application.
