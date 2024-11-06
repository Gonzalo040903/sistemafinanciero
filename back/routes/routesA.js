import { Router } from "express";
import Usuario from "../model/modelUsuario";
import 

const router = Router();

router.post('/login', async (req, res) => {
    const {nombre, apellido} =req.body;
    const usuario = await usuario.findOne({nombre, apellido});

    if(!user) {
        return res.status(401).json({error: 'Usuario o contraseña incorrectos'});
    }
})