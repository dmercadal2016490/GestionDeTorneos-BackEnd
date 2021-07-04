'use strict'

var Liga = require('../models/liga.model')
var Team = require('../models/team.model')
var User = require('../models/user.model')
var fs = require('fs');
const path = require('path');

function createLiga(req, res){
    var liga = new Liga();
    var params = req.body;
    var userId = req.params.idU

    if(userId != req.user.sub){
        return res.send({message: 'No tienes permiso para agregar una liga'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(userFind){
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
                                    User.findByIdAndUpdate(userId, {$push:{ligas: ligaSaved._id}}, {new: true}, (err, ligaPush)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general'})
                                        }else if(ligaPush){
                                            return res.send({message: 'Liga agregada con éxito!', ligaPush})
                                        }else{
                                            return res.send({message: 'No se agregó la liga'})
                                        }
                                    })
                                }else{
                                    res.send({message: 'No se guado el equipo'});
                                }
                            })
                        }
                    })
                }else{
                    res.send({message: "Ingresa todos los datos obligatorios"})
                }
            }else{
                res.status(404).send({message: 'Usuario inexistente'})
            }
        })
    }
}

function updateLiga(req, res){
    let userId = req.params.idU;
    let ligaId = req.params.idL
    let update = req.body;

    if(userId != req.user.sub){
        return res.send({message: 'No tienes permiso para realizar esta acción'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(userFind){
                if(update.name){
                    Liga.findOne({name: update.name}, (err, ligaFinded)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'})
                        }else if(ligaFinded){
                            return res.send({message: 'Nombre de liga ya en uso'})
                        }else{
                            Liga.findById(ligaId, (err, ligaFind)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general'})
                                }else if(ligaFind){
                                    User.findOne({_id: userId, ligas: ligaId}, (err, userFind)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general'})
                                        }else if(userFind){
                                                Liga.findByIdAndUpdate(ligaId, update,{new: true}, (err, ligaUpdated)=>{
                                                    if(err){
                                                        return res.status(500).send({message: 'Error general'})
                                                    }else if(ligaUpdated){
                                                        return res.send({message: 'Liga actualizada: ', ligaUpdated})
                                                    }else{
                                                        return res.send({message: 'Liga no actualizada'})
                                                    }
                                                })
                                        }else{
                                            return res.status(404).send({message: 'Usuario no encontrado'})
                                        }
                                    })
                                }else{
                                    return res.status(404).send({message: 'No se econtró la liga'})
                                }
                            })
                        }
                    })
                }else{
                    return res.send({message: 'Ingresa todos los datos obligatorios'})
                }
            }else{
                return res.status(404).send({message: 'Usuario no encontrado'})
            }
        })
    }
}

function deleteLiga(req, res){
    let userId = req.params.idU;
    let ligaId = req.params.idL;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta accion'})
    }else{
        User.findByIdAndUpdate({_id: userId, ligas: ligaId},
            {$pull:{ligas: ligaId}}, {new: true}, (err, ligaPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(ligaPull){
                    Liga.findOneAndRemove(ligaId, (err, ligaRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'})
                        }else if(ligaRemoved){
                            return res.send({message: 'Liga eliminada', ligaPull})
                        }else{
                            return res.send({message: 'No se eliminó la liga'})
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar la liga'})
                }
            }).populate('ligas')
    }
}

function getTeams(req, res){
    var ligaId = req.params.id;

    Liga.findById(ligaId).populate({
        path: 'teams',
        populate:{
            path: 'liga',
        }
    }).exec((err, teams)=>{
        if(err){
            res.status(500).send({message: 'Error al buscar Equipos'})
        }else if(teams){
            res.status(200).send({message: 'Equipos de la Liga', teams})
        }else{
            return res.status(404).send({message: 'No hay registros de equipos'})
        }
    })
}

function uploadLigaImage(req, res){
    var userId = req.params.idU;
    var ligaId = req.params.idL;
    var fileName;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permiso para cambiar la imagen de la Liga'})
    }else{
        if(req.files){
            var filePath = req.files.image.path;
        
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if(fileExt == 'png' ||
               fileExt == 'jpg' ||
               fileExt == 'jpeg' ||
               fileExt == 'gif'){
                Liga.findByIdAndUpdate(ligaId, {ligaImg: fileName}, {new: true}, (err, ligaUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(ligaUpdated){
                        res.send({liga: ligaUpdated, ligaImage:ligaUpdated.ligaImg});
                    }else{
                        res.status(400).send({message: 'No se ha podido actualizar'});
                    }
                })
            }else{
                fs.unlink(filePath, (err)=>{
                    if(err){
                        res.status(500).send({message: 'Extensión no válida y error al eliminar archivo'});
                    }else{
                        res.send({message: 'Extensión no válida'})
                    }
                })
            }
        }else{
            return res.status(400).send({message: 'No has subido ninguna imagen'})
        }
    }
}

function getImageLiga(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/liga/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

module.exports = {
    createLiga,
    getTeams,
    updateLiga,
    deleteLiga,
    uploadLigaImage,
    getImageLiga,
}