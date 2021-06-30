'use strict'

var Liga = require('../models/liga.model')
var Team = require('../models/team.model')
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

function addTeams(req, res){
    var ligaId = req.params.id
    var params = req.body
    let team = params._id

    Team.findById(team, (err, teamFind)=>{
        if(err){
            res.status(500).send({message: 'Error general'})
        }else if(teamFind){
            Liga.findById(ligaId, (err, ligaFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'})
                }else if(ligaFind){
                    if(ligaFind.teamCount > 10){
                        res.send({message: 'No se pueden tener más de 10 equipos en una liga'})
                    }else{
                        var liga = ligaFind.teamCount ++;
                        let team = teamFind
                        
                        Liga.findByIdAndUpdate({_id: ligaId}, {$push:{teams: team._id}, liga}, {new: true}, (err, teamSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al guardar el team'})
                            }else if(teamSaved){
                                Liga.findByIdAndUpdate(ligaId, {$inc:{teamCount: +1}}, {new:true}, (err, aumento)=>{
                                    if(err){
                                        res.send({message: 'Error al incrementar'})
                                    }else if(aumento){
                                        res.send({message: 'Team agregado', aumento})
                                    }else{
                                        res.send({message:'No se incremento'})
                                    }
                                })
                            }else{
                                res.send({message: 'no se guardó el team'})
                            }
                        })
                    }
                }else{
                    res.status(404).send({message: 'Liga no encontrada'})
                }
            })
        }else{
            res.status(404).send({message: 'Team no encontrado'})
        }
    })
}

module.exports = {
    createLiga,
    addTeams
}