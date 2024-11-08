import mongoose, {Schema, model} from 'mongoose';

const prestamoSchema = new Schema({
    cliente:{type:mongoose.Schema.Types.ObjectId, ref:'Cliente', required: true},
    monto: {type: Number, required: true},
    semanas: {type: Number, required: true},
    intereses: {type: Number, required: true},
    fechaInicio: {type: Date, default: Date.now},
    montoFinal: { type: Number },
    cuotasTotales: { type: Number },
    montoAdeudado: { type: Number },
    cuotasPagadas: { type: Number, default: 0 }
},{collection: 'Prestamo', versionKey: false});

prestamoSchema.pre('save', function(next){
    if(this.isNew){
        this.montoFinal = this.monto + (this.monto * (this.intereses / 100));
        this.montoAdeudado = this.montoFinal;  
        this.cuotasTotales = this.semanas;
    }
    next();
});

const Prestamo = model('Prestamo', prestamoSchema);
export default Prestamo; 