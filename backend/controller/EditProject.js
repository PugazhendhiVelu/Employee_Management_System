const path = require('path');
const ProjectModel = require(path.join(__dirname, '..', 'models', 'project'));

exports.editProject = async (req, res) => {
    try {
        // Extract parameters from the query
        const id = req.params.projectId; 
        const updateData = req.body;

        // Construct the filter based on provided identifiers
        const filter ={};
            filter._id = id;

        console.log('Filter:', filter);

        // Find the employee based on the constructed filter
        const project = await ProjectModel.findOne(filter);

        if (!project) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        console.log('Project:', project);

        // Update the Project record
        const updatedProject = await ProjectModel.findOneAndUpdate(
            filter, // Use the filter object directly
            updateData,
            { new: true, runValidators: true }
        );
        console.log('Updated Project:', updatedProject);

        // Respond with the updated employee data
        res.status(200).json(updatedProject);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
