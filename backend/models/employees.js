const mongoose = require("mongoose");
const mongooseSequence = require('mongoose-sequence')(mongoose);

const EmployeeSchema = new mongoose.Schema({
    // Personal details
    id: { type: Number, unique: true }, // Auto-incremented field
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    DoB: { type: Date, required: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    phone_number: {
        type: String,
        minlength: 10,
        maxlength: 10,
        required: true
    },
    address: { type: String, required: true },
    aadhar_number: {
        type: String,
        minlength: 12,
        maxlength: 12,
        required: true
    },

    // Only Higher Qualification details
    highest_qualification: { type: String, required: true },
    university: { type: String },
    year_of_graduation: {
        type: Number, 
        min: 1900, 
        max: new Date().getFullYear(),
        required: true
    },
    percentage: { type: Number, required: true },

    // Last company Experience
    previous_employer: { type: String },
    years_of_experience: {
        type: Number,
        min: 0   
    },
    previous_role: { type: String },  
    

    // Current Employment
    current_role: { type: String },  
    department: { type: String },
    joining_date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Active','Terminated', 'Resigned', 'Retired'],
        default: 'Active'
    },

    //Bank Details

    bank_name:{
        type:String,
        default:"ABC Bank , OMR Branch , Chennai"
    },
   
    account_number:{
        type:Number
    },
    ifsc_code:{
        type:String,
        default:"ABC2024260"
    },
    projects:{
        projectId:[{type:String}]
    }

});

// Apply the auto-increment plugin to the schema
EmployeeSchema.plugin(mongooseSequence, {
    inc_field: 'id', // The field to auto increment
    start_seq: 1 // Start with ID 1
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;
