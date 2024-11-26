import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const vendedorSchema = new Schema({
    nombre: {type:String, required: true},
    contraseña:{type: String, required: true},
    rol:{type: String,enum:['vendedor', 'admin'], default: 'vendedor'}
},{collection:'Vendedor', versionKey:false});

// encriptando la contrase;a antes de guardar el vendedor
vendedorSchema.pre('save', async function(next) {
    if (this.isModified('contraseña') && this.rol === 'admin') {
        const salt = await bcrypt.genSalt(10);
        this.contraseña = await bcrypt.hash(this.contraseña, salt);
    }
    next();
});

const Vendedor = model('Vendedor', vendedorSchema);
export default Vendedor;