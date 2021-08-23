const router = require('express').Router();

const userController = require('../controllers/userController')
const authenticateMiddleware = require('../middleware/authentificate')


router.route('/user/signUp').post(userController.signUp)
router.route('/user/signIn').post(userController.signIn)
router.route('/user/currentUser').get(authenticateMiddleware.authenticate, userController.currentUser)
router.route('/user/logOut').post(authenticateMiddleware.authenticate, userController.logOut)
router.route('/user/getAllUsers').get(userController.getAllUsers)
router.route('/user/updateUserGold').post(authenticateMiddleware.authenticate, userController.updateUserGold)
router.route('/user/updateUserHealth').post(authenticateMiddleware.authenticate, userController.updateUserHealth)
router.route('/user/addItemToInventory').post(authenticateMiddleware.authenticate, userController.addItemToInventory)
router.route('/user/removeItemFromInventory').post(authenticateMiddleware.authenticate, userController.removeItemFromInventory)
router.route('/user/updateUserImage').post(authenticateMiddleware.authenticate, userController.updateUserImage)
router.route('/user/resetUser').post(authenticateMiddleware.authenticate, userController.resetUser)

module.exports = router