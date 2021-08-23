const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    sessionToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expires: {
        type: Date,
        required: true
    },
})

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session