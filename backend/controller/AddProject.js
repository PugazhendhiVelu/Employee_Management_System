const path = require('path');
const EmployeeModel = require(path.join(__dirname, '..', 'models', 'employees'));
const ProjectModel = require(path.join(__dirname, '..', 'models', 'project'));
const { ObjectId } = require('mongodb');


exports.createProject = async (req, res) => {
  try {
    const { name,managerId, managerName, teams, description, deadline } = req.body;

    //Save in Project collection
    const newProject = new ProjectModel({
      name,
      manager: managerName, 
      teams,
      description,
      deadline
    });
    await newProject.save();

    
    const projectId = newProject._id.toHexString();

    //Adding project Id in Manager's profile
    const managerUpdate = EmployeeModel.findOneAndUpdate(
      { _id: new ObjectId(managerId) }, 
      { $push: { 'projects.projectId': projectId } }, 
      { new: true, runValidators: true }
    );
    await managerUpdate;
    
    // Update all team leaders and members
    const updatePromises = teams.map(team => {
      // Update the team leader
      const leaderUpdate = EmployeeModel.findOneAndUpdate(
        { _id: new ObjectId(team.leaderId) }, 
        { $push: { 'projects.projectId': projectId } }, 
        { new: true, runValidators: true }
      );
    
      // Update the team members
      const memberUpdates = team.members.map(memberId => {
        return EmployeeModel.findOneAndUpdate(
          { _id: new ObjectId(memberId) }, 
          { $push: { 'projects.projectId': projectId } }, 
          { new: true, runValidators: true }
        );
      });
    
      // Combine the leader and member updates into one promise
      return Promise.all([leaderUpdate, ...memberUpdates]);
    });
    
    // Wait for all teams' updates to complete
    await Promise.all(updatePromises);
    console.log('All teams updated successfully.');
    res.status(201).json({ message: 'Project created successfully', project: newProject });

  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ message: 'Error adding project', error });
  }
};
