import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const vendedorSchema = new Schema({
    nombre: {type:String, required: true},
    apellido: {type: String, requerid: true},
    constraseña:{type: String, requerid: true}
},{collection:'Vendedor', versionKey:false});

// encriotando la contrase;a andes de guardar el vendedor
vendedorSchema.pre('save', async function(next) {
    if (this.isModified('contraseña')) {
        const salt = await bcrypt.genSalt(10);
        this.contraseña = await bcrypt.hash(this.contraseña, salt);
    }
    next();
});

const Vendedor = model('Vendedor', vendedorSchema);
export default Vendedor;
