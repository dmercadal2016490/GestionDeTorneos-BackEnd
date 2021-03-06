'use strict'

var express = require('express');
var ligaController = require('../controllers/liga.controller');
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir: './uploads/liga'})

var api = express.Router();

api.post('/createLiga/:idU', [mdAuth.ensureAuth], ligaController.createLiga)
api.get('/:idU/verTeams/:idL', [mdAuth.ensureAuth],ligaController.verTeams)
api.put('/:idU/updateLiga/:idL', mdAuth.ensureAuth, ligaController.updateLiga)
api.put('/:idU/deleteLiga/:idL', mdAuth.ensureAuth, ligaController.deleteLiga)
api.put('/:idU/uploadLigaImage/:idL',[mdAuth.ensureAuth ,upload], ligaController.uploadLigaImage)
api.get('/getImageLiga/:fileName', [upload], ligaController.getImageLiga)
api.put('/:idU/updateLigaAdmin/:idL', mdAuth.ensureAuth, ligaController.updateLigaAdmin)
api.put('/:idU/deleteLigaAdmin/:idL', ligaController.deleteLigaAdmin)

module.exports = api;