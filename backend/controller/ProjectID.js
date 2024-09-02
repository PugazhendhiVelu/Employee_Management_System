const path = require('path');
const ProjectModel = require(path.join(__dirname, '..', 'models', 'project'));

exports.ProjectGetbyid = async (req, res) => {
    try {
        const id = req.params.projectId;  
        console.log(id);
        const project = await ProjectModel.findOne({_id:id });

        if (!project) {  // Check if no Project is found
            return res.status(404).send('No Project found');
        }

        res.json(project);
    } catch (err) {
        console.error('Error fetching project by ID:', err);
        res.status(500).send('Internal server error');
    }
};