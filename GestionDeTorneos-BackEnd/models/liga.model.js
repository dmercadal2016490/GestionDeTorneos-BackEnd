'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ligaSchema = Schema({
    name: String,
    descripcion:String,
    teamCount:Number,
    ligaImg:String,
    teams: [{type: Schema.ObjectId, ref:'team'}],
});

module.exports = mongoose.model('liga', ligaSchema)