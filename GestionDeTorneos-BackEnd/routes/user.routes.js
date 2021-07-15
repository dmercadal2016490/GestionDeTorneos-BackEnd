'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir: './uploads/user'})

var api = express.Router();

api.post('/register', userController.register);
api.post('/login', userController.login);

//Middlewares
api.post('/saveUser/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin] ,userController.saveUser)
api.put('/updateUser/:idU', mdAuth.ensureAuth, userController.updateUser)
api.put('/deleteUser/:idU', mdAuth.ensureAuth, userController.deleteUser)
api.get('/getUsers', userController.getUsers)
api.get('/getLigas/:id', [mdAuth.ensureAuth], userController.getLigas)

//image
api.put('/:id/uploadImage', [mdAuth.ensureAuth, upload], userController.uploadImage);
api.get('/getImage/:fileName', [upload], userController.getImage);

//admin
<<<<<<< HEAD
api.delete('/adminDeleteUser/:idU', userController.adminDeleteUser);
=======
api.put('/adminDeleteUser/:idU', userController.adminDeleteUser);
>>>>>>> master
api.put('/adminUpdateUser/:idU', userController.adminUpdateUser);

module.exports = api;