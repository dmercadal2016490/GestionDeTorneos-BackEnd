'use strict'

var Liga = require('../models/liga.model')
var fs = require('fs');
var path = require('path');

function createLiga(req, res){
    var liga = new Liga();
    var params = req.body;

    if(params.name && params.descripcion){
        Liga.findOne({name: params.name}, (err, ligaFind)=>{
            if(err){
                res.status(500).send({message: "Error general"})
            }else if(ligaFind){
                res.send({message: "Nombre de liga ya en uso"})
            }else{
                liga.name = params.name;
                liga.descripcion = params.descripcion;
                liga.teamCount = 0;

                liga.save((err, ligaSaved)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'})
                    }else if(ligaSaved){
                        res.send({message: "Liga agregada", ligaSaved})
                    }else{
                        res.send({message: 'No se guado el equipo'});
                    }
                })
            }
        })
    }else{
        res.send({message: "Ingresa todos los datos obligatorios"})
    }
}

module.exports = {
    createLiga,
}