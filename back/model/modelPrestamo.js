import mongoose, { Schema, model } from 'mongoose';

const prestamoSchema = new Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    monto: { type: Number, required: true },
    semanas: { type: Number, required: true },
    intereses: { type: Number, required: true },
    soloInteres: {type: Boolean, default: false},
    fechaInicio: { type: Date, default: Date.now },
    montoFinal: { type: Number },
    cuotasTotales: { type: Number },
    montoAdeudado: { type: Number },
    cuotasPagadas: { type: Number, default: 0 },
    vendedor: { type: String, required: true },
    pagos: [{
        fecha: { type: Date, required: true },
        monto: { type: Number, required: true }
    }]
}, { collection: 'Prestamo', versionKey: false });

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

const Prestamo = model('Prestamo', prestamoSchema);
export default Prestamo; 