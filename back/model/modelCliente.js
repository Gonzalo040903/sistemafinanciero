import { Schema, model } from 'mongoose';

const prestamoSchema = new Schema({
    monto: { type: Number, required: true },
    semanas: { type: Number, required: true },
    intereses: { type: Number, required: true },
    soloInteres: {type: Boolean, default: false},
    fechaInicio: { type: String, required: true },
    montoFinal: { type: Number },
    cuotasTotales: { type: Number },
    montoAdeudado: { type: Number },
    cuotasPagadas: { type: Number, default: 0 },
    vendedor: { type: String, required: true }
});

prestamoSchema.pre('save', function (next) {
    if (this.isNew) {
        if(this.soloInteres){
            this.montoFinal = this.monto * (this.intereses / 100);
        }
        else{
            this.montoFinal = this.monto + (this.monto * (this.intereses / 100));
        }
        this.montoAdeudado = this.cuotasPagadas * (this.montoFinal / this.semanas);
        this.cuotasTotales = this.semanas;

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
}, { collection: 'Cliente', versionKey: false, timestamps: true });

const Cliente = model('Cliente', clienteSchema);
export default Cliente;
