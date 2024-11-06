import { model,Schema } from 'mongoose';
import bcrypt from 'bcrypt';
const usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    role: {
        type: String,
        enum: ['admin', 'vendedor'],
        required: true
    },
    password:{
        type: String,
        required: true
    }
},{collection:'Usuario', versionKey:false});

usuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
const Usuario = model('Usuario', usuarioSchema);
export default Usuario;
