import Cliente from '../model/modelCliente.js';
//crear cliente
export const createCliente = async (req, res) => {
    
    const {nombre, apellido, dni, direccion, telefonoPersonal, telefonoReferencia, telefonoTres} = req.body;
    if(!nombre || !apellido || !dni || !direccion || !telefonoPersonal || !telefonoReferencia || !telefonoTres){
        return res.status(400).json({message:'Todos los campos son obligarorios'});
    }

    
    try {
      const nuevoCliente = new Cliente({nombre, apellido, dni, direccion, telefonoPersonal, telefonoReferencia, telefonoTres});
      const clienteGuardado = await nuevoCliente.save();
      res.status(201).json(clienteGuardado);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
};

//obtener todos los clientes
export const getCliente = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }   
};
//obtener por apellido
export const getClienteByApellido = async(req, res) => {
    const {apellido} = req.params;
    try {
        const clientes = await Cliente.find({ apellido: new RegExp(apellido, 'i') });
        if (clientes.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//actualizar cliente
export const updateCliente = async(req, res) =>{
    try {
        const cliente = await Cliente.find({ apellido: req.params.apellido});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        const {nombre, apellido, dni, direccion, telefonoPersonal, telefonoReferencia } = req.body;
        if(nombre) cliente.nombre = nombre;
        if(apellido) cliente.apellido = apellido;
        if(dni) cliente.dni = dni;
        if(direccion) cliente.direccion = direccion;
        if(telefonoPersonal) cliente.telefonoPersonal = telefonoPersonal;
        if(telefonoReferencia) cliente.telefonoReferencia = telefonoReferencia;
        await cliente.save();
        res.json({message:'Cliente actualizado', cliente});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
//eliminar cliente
export const deleteCliente = async(req, res) => {
    try {
        const cliente = await Cliente.findOne({ apellido: req.params.apellido});
        if(cliente == null){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        await cliente.deleteOne({ apellido: req.params.apellido})
        res.json({message: 'Cliente eliminado'});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
