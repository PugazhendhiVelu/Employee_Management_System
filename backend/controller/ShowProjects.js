const path = require('path');
const ProjectModel = require(path.join(__dirname, '..', 'models', 'project'));

exports.DisplayProject = async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        if (projects.length === 0) {
            return res.status(404).send('No projects found ');
        }
        res.json(projects);
    } catch (err) {
        console.error('Failed to fetch projects. Error:', err);
        res.status(500).send('Internal server error');
    }
};