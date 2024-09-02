const path = require('path');
const EmployeeModel = require(path.join(__dirname, '..', 'models', 'employees'));

exports.Editbyid = async (req, res) => {
    try {
        // Extract parameters from the query
        const id = req.params.employeeId; 
        const updateData = req.body;

        // Check if at least one identifier is provided
        if (!id && !email && !phno) {
            return res.status(400).json({ error: 'At least one identifier (id, email, or phone number) is required' });
        }

        // Construct the filter based on provided identifiers
        const filter = {};
        if (id) {
            filter.id = id;
        } else if (email) {
            filter.email = email;
        } else if (phno) {
            filter.phno = phno;
        }

        console.log('Filter:', filter);

        // Find the employee based on the constructed filter
        const employee = await EmployeeModel.findOne(filter);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        console.log('Employee:', employee);

        // Update the employee record
        const updatedEmployee = await EmployeeModel.findOneAndUpdate(
            filter, // Use the filter object directly
            updateData,
            { new: true, runValidators: true }
        );
        console.log('Updated Employee:', updatedEmployee);

        // Respond with the updated employee data
        res.status(200).json(updatedEmployee);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
