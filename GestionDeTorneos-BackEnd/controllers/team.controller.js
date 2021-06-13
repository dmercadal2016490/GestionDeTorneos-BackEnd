'use strict'

var Team = require('../models/team.model');
var User = require('../models/user.model')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function createTeam(req,res){
    var team = new Team();
    var params = req.body;
    var userId = req.params.idU;

    if (userId != req.user.sub){
        res.status(500).send({message: 'No tienes permiso para agregar a un equipo'})
    }else{
        if(params.name && params.country){
            Team.findOne({name: params.name}, (err,teamFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'})
                    console.log(err)
                }else if(teamFind){
                    res.send({message: 'Nombre de equipo ya en uso'})
                }else{
                    team.name = params.name;
                    team.country = params.country;
                    team.playerCount = 0;

                    team.save((err, teamSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al salvar el equipo'});
                            console.log(err);
                        }else if(teamSaved){
                            res.send({message: 'Equipo guardado: ', teamSaved})
                        }else{
                            res.send({message: 'No se guado el equipo'});
                        }
                    })
                }
            })
        }else{
            res.send({message: 'Porfavor ingresa nombre y pais del equipo'})
        }
    }
}

function setPlayer(req,res){
    var CaptainId = req.params.idU;
    var teamId = req.params.idE
    var params = req.body;
    var team = new Team();

    if (CaptainId != req.user.sub){
        res.status(500).send({message: 'No tienes permiso para agregar jugadores a un equipo'})
    }else{
        let player = params._id
        User.findById(player, (err,userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar el usuario'})
                console.log(err)
            }else if(userFind){
                Team.findById(teamId, (err,teamFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al buscar el equipo'});
                        console.log(err);
                    }else if(teamFind){
                        var team = teamFind.playerCount ++;
                        let jugador = userFind;
                        
                        Team.findOneAndUpdate({_id: teamId}, {$push:{players: jugador._id}, team}, {new:true}, (err, playerSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al guardar el jugador'})
                                console.log(err)
                            }else if(playerSaved){
                                Team.findByIdAndUpdate(teamId, {$inc: {playerCount:+1}},{new:true}, (err, aumento)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error al incrementar'})
                                        console.log(err)
                                    }else if(aumento){
                                        res.send({message: 'Jugador guarado: ', aumento})
                                    }else{
                                        res.send({message:'No se incremento'})
                                    }
                                })
                            }else{
                                res.send({message:'No se salvo el jugador'})
                            }
                        })
                    }else{
                        res.status(404).send({message: 'El equipo que buscas no existe'})
                    }
                })
                //res.send({message: 'Usario encontrado: ', userFind})
            }else{
                res.send({message: 'El usuario que quieres agregar no existe'})
            }
        })
    }
}

module.exports ={
    createTeam,
    setPlayer
}