import { Router } from 'express';
import Cliente from '../model/modelCliente.js'

const router = Router();

//crear cliente
router.post('/', async (req, res) => {
    const {
        nombre,
        apellido,
        dni,
        direccion,
        googleMaps,
        telefonoPersonal,
        telefonoReferencia,
        telefonoTres,
        prestamoActual,
        historialPrestamos
    } = req.body;

    if (!nombre || !apellido || !dni || !direccion || !telefonoPersonal || !telefonoReferencia || !telefonoTres || !prestamoActual) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const nuevoCliente = new Cliente({
            nombre,
            apellido,
            dni,
            direccion,
            googleMaps,
            telefonoPersonal,
            telefonoReferencia,
            telefonoTres,
            prestamoActual: prestamoActual || null, //opcional?
            historialPrestamos: historialPrestamos || []
        });

        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json(clienteGuardado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Obetener Clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//obtener por dni
router.get('/:dni/prestamo', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ dni: req.params.dni });
        if (cliente.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(cliente.prestamoActual);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//actualizar cliente
router.patch('/:dni', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ dni: req.params.dni });
        if (cliente == null) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const { nombre, apellido, dni, direccion, googleMaps, telefonoPersonal, telefonoReferencia, telefonoTres, historialPrestamos } = req.body;
        if (nombre) cliente.nombre = nombre;
        if (apellido) cliente.apellido = apellido;
        if (dni) cliente.dni = dni;
        if (direccion) cliente.direccion = direccion;
        if (googleMaps) cliente.googleMaps = googleMaps;
        if (telefonoPersonal) cliente.telefonoPersonal = telefonoPersonal;
        if (telefonoReferencia) cliente.telefonoReferencia = telefonoReferencia;
        if (telefonoTres) cliente.telefonoTres = telefonoTres;
        if (historialPrestamos && Array.isArray(historialPrestamos)) { cliente.historialPrestamos = cliente.historialPrestamos.concact(historialPrestamos) };
        await cliente.save();
        res.json({ message: 'Cliente actualizado', cliente });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//eliminar cliente
router.delete('/:dni', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ dni: req.params.dni });
        if (cliente == null) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        await cliente.deleteOne({ dni: req.params.dni })
        res.json({ message: 'Cliente eliminado' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint PATCH para actualizar cuotas y recalcular montoAdeudado
// Endpoint PATCH para actualizar cuotas y recalcular montoAdeudado
router.patch('/:dni/prestamo/cuotas', async (req, res) => {
    const { dni } = req.params;
    const { cuotasPagadas } = req.body;

    try {
        const cliente = await Cliente.findOne({ dni }).populate('prestamoActual');
        if (!cliente) return res.status(404).send("Cliente no encontrado");

        // Verifica que exista un préstamo asociado al cliente
        if (!cliente.prestamoActual) {
            return res.status(400).json({ message: 'No hay préstamo asociado a este cliente' });
        }

        // Actualizar el número de cuotas pagadas
        cliente.prestamoActual.cuotasPagadas = cuotasPagadas;

        // Calcular el valor de cada cuota
        const cuotaValor = cliente.prestamoActual.montoFinal / cliente.prestamoActual.cuotasTotales;

        // Calcular el monto adeudado como el total pagado hasta el momento
        cliente.prestamoActual.montoAdeudado = cuotaValor * cuotasPagadas;

        // Guardar los cambios
        await cliente.save();

        // Retornar la respuesta con el cliente actualizado
        res.status(200).send(cliente);
    } catch (error) {
        console.error("Error al actualizar cuotas:", error);
        res.status(500).send("Error al actualizar cuotas");
    }
});


export default router;