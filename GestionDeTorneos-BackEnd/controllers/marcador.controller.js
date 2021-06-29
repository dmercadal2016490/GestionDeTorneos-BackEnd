'use strict'

var Team = require('../models/team.model');
var Marcador = require('../models/marcador.model');
var jwt = require('../services/jwt');

/*function setMarcador(req, res){
    var Equipo1 = req.params.e1;
    var Equipo2 = req.params.e2;
    var params = req.body;
    var marcador = new Marcador();
  //  if(params.jornada && params.goles1 && params.goles2){
        Team.findById(Equipo1, (err, EquiposFind)=>{
            if(err){
                return res.status(500).send({messsage: 'No tienes permisos para realizar esta accion'})
            }else if(EquiposFind){
                marcador.jornada = params.jornada; 
                marcador.goles1 = params.goles1;
                marcador.goles2 = params.goles2;

                marcador.save((err, marcadorSaved)=>{
                    if(err){
                        return res.status(500).send({messsage: 'Error general'})
                    }else if(marcadorSaved){
                        Team.findByIdAndUpdate(Equipo1, {$push: {marcador: marcadorSaved._id}}, {new: true}, (err, marcadorPush)=>{
                        if(err){
                            return res.status(500).send({messsage: 'Error'})
                        }else if(marcadorPush){
                            res.send({messsage: 'Equipo agregado al marcador', marcadorPush})
                        }else{
                            return res.status(500).send({messsage: 'Error'})
                        }
                        })
                    }else{
                        return res.status(500).send({messsage: 'Error'})
                    }
                })
            }else{
                return res.status(500).send({messsage: 'No existe el equipo'});
            }
    })
}*/

function setMarcador(req, res){
    var marcador = new Marcador();
    var params = req.body;
    var Equipo1 = req.params.e1;
    var Equipo2 = req.params.e2;


    if(params.jornada && params.goles1 && params.goles2){

        if(params.goles1 < 0 || params.goles2 < 0 || params.jornada < 0){
            res.status(500).send({message: 'Ingrese datos mayores o iguales a 0'})
        } else{
        marcador.jornada = params.jornada;
        marcador.goles1 = params.goles1;
        marcador.goles2 = params.goles2;
        marcador.equipo1 = Equipo1;
        marcador.equipo2 = Equipo2;

        var diferencia1 = marcador.goles1 - marcador.goles2;
        var diferencia2 = marcador.goles2 - marcador.goles1;
        var puntos1;
        var puntos2;

        if(marcador.goles1 > marcador.goles2){
            puntos1  = 3;
            puntos2 = 0;
        }else if(marcador.goles1 < marcador.goles2){
            puntos2 = 3;
            puntos1 = 0;
        }else{
            puntos1 = 1;
            puntos2 = 1; 
        }
        
        marcador.save((err, marcadorSaved)=>{
            if(err){
                res.status(500).send({message: 'Error general'})
            }else if(marcadorSaved){
                Team.findByIdAndUpdate(Equipo1, {$inc: {golesFavor: marcador.goles1}}, {new: true}, (err, aumento)=>{
                    /*if(err){
                        res.status(500).send({message: 'Error al incrementar'})
                    }else if(aumento){
                        res.send({message: 'marcador guarado'})
                    }else{
                        res.send({message:'No se incremento'})
                    }*/
                })

                Team.findByIdAndUpdate(Equipo1, {$inc: {golesContra: marcador.goles2}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo2, {$inc: {golesFavor: marcador.goles2}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo2, {$inc: {golesContra: marcador.goles1}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo1, {$inc: {partidos: 1}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo2, {$inc: {partidos: 1}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo1, {$inc: {golesDiferencia: diferencia1}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo2, {$inc: {golesDiferencia: diferencia2}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo1, {$inc: {puntos: puntos1}}, {new: true}, (err, aumento)=>{
                })

                Team.findByIdAndUpdate(Equipo2, {$inc: {puntos: puntos2}}, {new: true}, (err, aumento)=>{
                })

                res.send({message: 'Marcador añadido', marcadorSaved})
                
            }else{
                res.status(500).send({message: 'No se guardo el marcador'})
            }
        })
    }}else{
        res.send({message: 'Ingrese datos completos'})
    }
}


module.exports = {
    setMarcador
}