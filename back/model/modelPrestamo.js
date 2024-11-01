import mongoose, {Schema, model} from 'mongoose';

const prestamoSchema = new Schema({
    cliente:{type:mongoose.Schema.Types.ObjectId, ref:'Cliente', required: true},
    montoInicial: {type: Number, required: true},
    semanas: {type: Number, required: true},
    intereses: {type: Number, required: true},
    fechaInicio: {type: Date, default: Date.now},
    montoFinal: { type: Number },
    cuotasTotales: { type: Number, required: true },
    montoAdeudado: { type: Number },
    cuotasPagadas: { type: Number, default: 0 }

},{collection: 'Prestamo', versionKey: false});
prestamoSchema.pre('save', function(next){
    if(this.isNew){
        this.montoFinal = this.montoInicial + (this.montoInicial * (this.interes / 100) * this.semanas);
        this.montoAdeudado = this.montoFinal;  
    }
    next();
})

const Prestamo = model('Prestamo', prestamoSchema);

export default Prestamo;