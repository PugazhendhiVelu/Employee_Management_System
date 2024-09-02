const mongoose = require("mongoose");
const path = require('path')
const DBConnect = require(path.join(__dirname, '..','config', 'DBConnection'));
const SequenceModel = require(path.join(__dirname,'..','models','seq'));
// Assuming `mongooseSequence` is already required and used
const getLatestSequence = async () => {
    try {
        const sequence = await SequenceModel.findOne(
            { id:'id' }
        );

        if (sequence) {
            const seq = sequence.seq;
            console.log("In function of sequence",seq);
            return seq;
        } else {
            throw new Error('Sequence not found');
        }
    } catch (error) {
        console.error('Error fetching latest sequence:', error.message);
        throw error;
    }
};
module.exports = getLatestSequence;

