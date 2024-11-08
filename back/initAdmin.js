import Vendedor from './model/modelVendedor.js'; // Asegúrate de que el modelo esté bien importado
import bcrypt from 'bcrypt';

const initAdmin = async () => {
  try {
    const adminExistente = await Vendedor.findOne({ nombre: 'Facundo', apellido: 'Heredia' });
    console.log('Buscando administrador...', adminExistente); // Depurar la búsqueda

    if (!adminExistente) {
      console.log('Administrador no encontrado, creando...');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('contraseña-segura', salt); // Cambia 'contraseña-segura'

      const nuevoAdmin = new Vendedor({
        nombre: 'Facundo',
        apellido: 'Heredia',
        password: hashedPassword,
        rol: 'admin' // Asignamos el rol de administrador
      });

      await nuevoAdmin.save();
      console.log('Administrador creado exitosamente');
    } else {
      console.log('El administrador ya existe');
    }
  } catch (error) {
    console.error('Error al crear el administrador', error);
  }
};

initAdmin();
