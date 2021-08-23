const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
    },
    health: {
        type: "Number",
        default: 100
    },
    gold: {
        type: "Number",
        default: 100
    },
    inventory: [],
    createdAt: {
        type: Date,
        default: new Date
    },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password
        }
    }
})

userSchema.pre('save', function(next) {
    let user = this
    if (user.isModified('password')) {
        let hash = bcrypt.hashSync(user.password, 10)
        user.password = hash
        next()
    } else {
        next()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User