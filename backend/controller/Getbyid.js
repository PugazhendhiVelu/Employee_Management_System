const path = require('path');
const EmployeeModel = require(path.join(__dirname, '..', 'models', 'employees'));

exports.Getbyid = async (req, res) => {
    try {
        const id = req.params.employeeId;  
        console.log(id);
        const employee = await EmployeeModel.findOne({id });

        if (!employee) {  // Check if no employee is found
            return res.status(404).send('No employee found');
        }

        res.json(employee);
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        res.status(500).send('Internal server error');
    }
};