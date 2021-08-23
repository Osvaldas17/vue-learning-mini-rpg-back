const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Session = require('../models/sessionModel')

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers['userauth']
        let decoded = jwt.verify(token, process.env.JWT_PASSWORD)
        let session = await Session.findOne({
            sessionToken: token
        })
        if (!session) throw 'Error'
        let user = await User.findOne({
            _id: decoded.id
        })
        if (!user) throw 'Error'
        req.user = user
        req.sessionToken = session
        next()
    } catch (e) {
        res.status(401).send({
            message: 'You are not authorized'
        })
    }
}

module.exports = {
    authenticate
}