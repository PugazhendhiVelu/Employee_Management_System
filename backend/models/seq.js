const mongoose = require('mongoose')



const SequenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, required: true },

});

const SequenceModel = mongoose.model("counters", SequenceSchema);

module.exports = SequenceModel;