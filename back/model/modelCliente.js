import {Schema, model} from 'mongoose';

const clienteSchema = new Schema({
    dni: {type: Number, required: true},
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    direccion: {type: String, required: true},
    telefonoPersonal: {type: Number, required: true},
    telefonoReferencia: {type: Number, required: true},
},{collection:'Cliente', versionKey:false});

const Cliente = model('Cliente', clienteSchema);
export default Cliente;