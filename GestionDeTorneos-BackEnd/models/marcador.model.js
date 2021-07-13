'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marcadorSchema = Schema({
    jornada: Number,
    goles1: String,
    goles2: String,
    equipo1: [{type: Schema.ObjectId, ref:'team'}],
    equipo2: [{type: Schema.ObjectId, ref:'team'}]
})

module.exports = mongoose.model('marcador', marcadorSchema);