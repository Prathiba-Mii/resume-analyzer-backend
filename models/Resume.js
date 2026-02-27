const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    analysis: { type: String },
    atsScore: { type: Number },
    roadmap: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Resume', resumeSchema)