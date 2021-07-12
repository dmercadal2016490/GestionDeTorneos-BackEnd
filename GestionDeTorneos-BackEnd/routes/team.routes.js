'use strict'

var express = require('express');
var teamController = require('../controllers/team.controller');
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir: './uploads/team'})

var api = express.Router();

api.put('/:idU/saveTeam/:idL', [mdAuth.ensureAuth], teamController.createTeam);
api.get('/getTeams', [mdAuth.ensureAuth],teamController.getTeams);
api.put('/:idU/updateTeam/:idL/:idT', [mdAuth.ensureAuth], teamController.updateTeam)
api.put('/:idU/deleteTeam/:idL/:idT', [mdAuth.ensureAuth], teamController.deleteTeam)

//Image
api.put('/:id/teamImage/:idT', [mdAuth.ensureAuth,mdAuth.ensureAuthCaptain,upload], teamController.uploadTeamImage)
api.get('/getImageT/:fileName', [upload], teamController.getImage);

module.exports = api;