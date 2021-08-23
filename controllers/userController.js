const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Session = require('../models/sessionModel')

const getAllUsers = async (req, res) => {
    const allUsers = await User.find()
    res.send(allUsers)
}

const updateUserGold = async (req, res) => {
    let user = req.user
    if (req.body.gold || req.body.gold === 0 && !isNaN(req.body.gold)) {
        user.gold = req.body.gold
        await user.save()
    }
    res.send({
        message: 'gold updated'
    })
}
const updateUserHealth = async (req, res) => {
    let user = req.user
    if (req.body.health) {
        user.health = req.body.health
        await user.save()
    }
    res.send({
        message: 'health updated'
    })
}
const resetUser = async (req, res) => {
    let user = req.user
    user.health = 100
    user.inventory = []
    user.gold = 100
    await user.save()
    res.send({
        message: 'user stats successfully reset'
    })
}
const addItemToInventory = async (req, res) => {
    let user = req.user
    try {
        if (req.body.item) {
            for (let i = 0; i < user.inventory.length; i++) {
                if (user.inventory[i].name === req.body.item.name && req.body.item.type !== 'potion') throw {
                    message: 'item is already purchased'
                }
            }
            user.inventory.push(req.body.item)
            await user.save()
        }
        res.send({
            message: 'item added to inventory'
        })
    } catch (e) {
        res.send({...e,success: false})
    }
}
const removeItemFromInventory = async (req, res) => {
    let user = req.user
    let item = req.body.item
    try {
        if (item && item.type !== "potion") {
            for (let i = 0; i < user.inventory.length; i++) {
                if (user.inventory[i].name === item.name) {
                    let elToRemove = user.inventory.findIndex((el) => el.name === item.name)
                    user.inventory.splice(elToRemove, 1)
                }
            }
            await user.save()
        } else if (item.type === 'potion') {
            let index = user.inventory.findIndex(i => i.name === item.name);
            user.inventory.splice(index, 1)
            await user.save()
        } else throw {
            message: 'please provide item name to delete'
        }
        res.send({
            message: 'item deleted successfully'
        })
    } catch (e) {
        res.send({...e,success: false})
    }

}
const updateUserImage = async (req, res) => {
    let user = req.user
    if (req.body.image) {
        user.image = req.body.image
        await user.save()
    }
    res.send(user)
}

const signUp = async (req, res) => {

    const regex = /\d/

    try {
        let checkUsername = await User.findOne({
            username: req.body.username
        })
        if (req.body.username.length < 4 && req.body.username.length > 20) throw {
            message: 'username must be from 4 to 20 characters long'
        }
        if (req.body.password.length < 4 && req.body.password.length > 20) throw {
            message: 'password must be from 4 to 20 characters long'
        }
        if (!regex.test(req.body.password)) throw {
            message: 'needs to contain at least one numeric value'
        }
        if (checkUsername) throw {
            message: 'Username is already taken'
        }
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })

        let newUser = await user.save()
        res.send(newUser)

    } catch (e) {
        console.log(e)
        res.send({...e,success: false})
    }
}

const signIn = async (req, res) => {
    try {
        let user = await User.findOne({
            username: req.body.username
        })
        if (!user) throw {
            message: 'Wrong username'
        }
        let passwordMatch = bcrypt.compareSync(req.body.password, user.password)

        console.log(passwordMatch, req.body.password, user.password)
        if (!passwordMatch) throw {
            message: 'Wrong password'
        }

        let token = jwt.sign({
            id: user._id,
            role: 'user'
        }, process.env.JWT_PASSWORD)


        let session = new Session({
            sessionToken: token,
            expires: new Date().setMonth(new Date().getMonth() + 1)
        })

        await session.save()


        res.header('userauth', token).send(user)

    } catch (e) {
        res.status(400).send(e)
    }
}

const currentUser = (req, res) => {
    res.send(req.user)
}

const logOut = async (req, res) => {
    try {
        let token = req.sessionToken
        await token.remove()
        res.send({
            message: 'Success'
        })
    } catch (e) {
        res.status(400).send({
            message: 'Something went wrong'
        })
    }

}

module.exports = {
    signUp,
    signIn,
    currentUser,
    logOut,
    getAllUsers,
    updateUserGold,
    updateUserHealth,
    addItemToInventory,
    updateUserImage,
    removeItemFromInventory,
    resetUser
}