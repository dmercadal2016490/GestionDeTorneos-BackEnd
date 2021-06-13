'use strict'

var express = require('express');
var teamController = require('../controllers/team.controller');
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir: './uploads/user'})

var api = express.Router();

api.post('/saveTeam/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], teamController.createTeam);
api.put('/:idE/setPlayer/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthCaptain], teamController.setPlayer);

module.exports = api;