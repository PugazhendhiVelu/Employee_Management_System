const path = require('path');
const EmployeeModel = require(path.join(__dirname, '..', 'models', 'employees'));

exports.DisplayEmployee = async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        if (employees.length === 0) {
            return res.status(404).send('No employees found ');
        }
        res.json(employees);
    } catch (err) {
        console.error('Failed to fetch employees. Error:', err);
        res.status(500).send('Internal server error');
    }
};