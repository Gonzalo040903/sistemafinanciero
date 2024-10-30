import {Schema, model} from 'mongoose';

const prestamoSchema = new Schema({
    montoPrestamo: {type: Number, required: true},
    semanas: {type: Number, required: true},
    intereses: {type: Number, required: true},
    fechaInicio: {type: Date, default: Date.now}
},{collection: 'Prestamo', versionKey: false});

const Prestamo = model('Prestamo', prestamoSchema);

export default Prestamo;