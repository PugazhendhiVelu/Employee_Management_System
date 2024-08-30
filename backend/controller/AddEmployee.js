const path = require('path');
const EmployeeModel = require(path.join(__dirname, '..', 'models', 'employees'));

exports.createEmployee = async (req, res) => {
    const employeeData = req.body;
    try {
        // Check for existing employee by id, email, phone number, or aadhar
        const existingEmployee = await EmployeeModel.findOne({
            $or: [
                { email: employeeData.email },
                { phno: employeeData.phno },
                { aadhar: employeeData.aadhar }
            ]
        });

        // if (existingEmployee) {
        //     if (existingEmployee.email === employeeData.email) {
        //         return res.status(400).json({ message: 'Email id is already taken' });
        //     } else if (existingEmployee.phno === employeeData.phno) {
        //         return res.status(400).json({ message: 'Phone number is already taken' });
        //     } else if (existingEmployee.aadhar === employeeData.aadhar) {
        //         return res.status(400).json({ message: 'Aadhar number is already taken' });
        //     }
        // }

        // Create a new employee if no duplicates found
        console.log(employeeData);
        
        await EmployeeModel.create(employeeData);
        return res.status(201).json({ message: 'Employee created successfully' });

    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
