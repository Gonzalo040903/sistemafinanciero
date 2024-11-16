import { Schema, model } from 'mongoose';

const prestamoSchema = new Schema({
    monto: { type: Number, required: true },
    semanas: { type: Number, required: true },
    intereses: { type: Number, required: true },
    fechaInicio: { type: String, required: true },
    montoFinal: { type: Number },
    cuotasTotales: { type: Number },
    montoAdeudado: { type: Number },
    cuotasPagadas: { type: Number, default: 0 },
    vendedor: { type: String, required: true }
});

prestamoSchema.pre('save', function (next) {
    if (this.isNew) {
        this.montoFinal = this.monto + (this.monto * (this.intereses / 100));
        this.cuotasTotales = this.semanas;
        this.montoAdeudado = this.cuotasPagadas * (this.montoFinal / this.cuotasTotales);
    }
    next();
});

const clienteSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: Number, required: true },
    direccion: { type: String, required: true },
    googleMaps: { type: String, required: true },
    telefonoPersonal: { type: Number, required: true },
    telefonoReferencia: { type: Number, required: true },
    telefonoTres: { type: Number, required: true },
    prestamoActual: { type: prestamoSchema, required: true },
    historialPrestamos: { type: [prestamoSchema], default: [] }
}, { collection: 'Cliente', versionKey: false });

const Cliente = model('Cliente', clienteSchema);
export default Cliente;
