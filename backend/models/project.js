const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    leaderName: { type: String, required: true },
    membersNames: [{ type: String }],
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manager: { type: String, required: true },
  teams: [TeamSchema],
  description: { type: String },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Ongoing', 'Terminated', 'Completed', 'Yet to Start'],
    default: 'Yet to Start'
}

});

const ProjectModel = mongoose.model("projects", ProjectSchema);

module.exports = ProjectModel;