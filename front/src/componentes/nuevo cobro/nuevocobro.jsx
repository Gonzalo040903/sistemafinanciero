import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBCard,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBIcon,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBInput,
    MDBRow,
    MDBCol,
    MDBModal,
    MDBModalHeader,
    MDBModalDialog,
    MDBModalContent
} from 'mdb-react-ui-kit';
import "./nuevocobro.css";

export function Nuevocobro() {
    const[formData, setFormData] = React.useState({
        soloInteres: false,
    })
    const CustomInput = ({ label, type, id, value, onChange }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} value={value} onChange={onChange} />
    );
    const calcular = (e) => {
        e.preventDefault();
        let monto = parseInt(document.getElementById("formMonto").value);
        let intereses = parseInt(document.getElementById("formIntereses").value);
        let montoFinal = formData.soloInteres ? monto * (intereses / 100) : monto + monto * (intereses / 100);
        let semana = parseInt(document.getElementById("formSemanas").value);
        let montoxsemana = montoFinal / semana;
        let semanapaga = document.getElementById("formSemanaPaga")
        let devuelve = document.getElementById("formDevuelve")
        if (monto && intereses) {
            semanapaga.value = montoxsemana;
            devuelve.value = montoFinal;
        }
    }
    const montoAdeudadofunicion = () => {
        if (clienteSeleccionado && clienteSeleccionado.prestamoActual) {
            return clienteSeleccionado.prestamoActual.montoAdeudado;
        }
        return 0;
    };
    const calcularMontoFaltante = () => {
        if (clienteSeleccionado && clienteSeleccionado.prestamoActual) {
            const cuotaValor = clienteSeleccionado.prestamoActual.montoFinal / clienteSeleccionado.prestamoActual.cuotasTotales;
            const cuotasRestantes = clienteSeleccionado.prestamoActual.cuotasTotales - clienteSeleccionado.prestamoActual.cuotasPagadas;
            return cuotaValor * cuotasRestantes;
        }
        return 0;
    };
    const calcularCuotasFaltantes = () => {
        if (clienteSeleccionado && clienteSeleccionado.prestamoActual) {
            const cuotasRestantes = clienteSeleccionado.prestamoActual.cuotasTotales - clienteSeleccionado.prestamoActual.cuotasPagadas;
            return cuotasRestantes;
        }
        return 0;
    };
    const funcionSuccess = (e) => {
        e.preventDefault();
        toast.success('Prestamo Creado')
        toggleOpen2()
    }
    let palabra = "Panel de control > Nuevo Cobro"
    const [clientes, setClientes] = useState([]);
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const [basicModal2, setBasicModal2] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState({}); // Inicializar con un objeto vacío
    const [cuotasPagadas, setCuotasPagadas] = useState(0);
    const toggleOpen = (cliente) => {
        if (cliente) {
            setClienteSeleccionado(cliente);
            setCuotasPagadas(cliente.prestamoActual ? cliente.prestamoActual.cuotasPagadas : 0);
        } else {
            setClienteSeleccionado({});
            setCuotasPagadas(0);
        }
        setBasicModal(!basicModal);
    };


    const toggleOpen2 = (cliente) => {
        if (cliente) {
            setClienteSeleccionado(cliente); // Selecciona el cliente
            setCuotasPagadas(cliente.prestamoActual ? cliente.prestamoActual.cuotasPagadas : 0);
        } else {
            setClienteSeleccionado({});
            setCuotasPagadas(0);
        }
        setBasicModal2(!basicModal2); // Abre el modal
    };
    const toggleGestionClientes = () => setIsGestionClientesOpen(!isGestionClientesOpen);
    const fetchClientes = async () => {
        try {
            const response = await axios.get('https://sistemafinanciero.up.railway.app/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };
    // Función para obtener los datos de los clientes desde la API
    useEffect(() => {
        fetchClientes();
    }, []);

    const handleCuotasChange = (event) => {
        setCuotasPagadas(Number(event.target.value));
    };

    let cuotaspagadas = 0
    const actualizarCuotasPagadas = async () => {
        if (clienteSeleccionado && cuotasPagadas >= 0) {
            try {
                const response = await fetch(`https://sistemafinanciero.up.railway.app/api/clientes/${clienteSeleccionado.dni}/prestamo/cuotas`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cuotasPagadas: cuotasPagadas
                    })
                });

                if (response.status === 200) {
                    const updatedCliente = await response.json(); // Obtener la respuesta con el cliente actualizado

                    // Mostrar un mensaje de éxito
                    toast.success('Cuotas actualizadas correctamente');

                    // Actualizar clienteSeleccionado con los valores actualizados
                    setClienteSeleccionado(prev => ({
                        ...prev,
                        prestamoActual: {
                            ...updatedCliente.prestamoActual, // Usamos los datos del cliente actualizado
                        }
                    }));

                    // Actualizar el estado de la lista de clientes
                    setClientes(prevClientes =>
                        prevClientes.map(cliente =>
                            cliente.dni === updatedCliente.dni
                                ? { ...cliente, prestamoActual: updatedCliente.prestamoActual }
                                : cliente
                        )
                    );
                } else {
                    throw new Error("La actualización no fue exitosa.");
                }
            } catch (error) {
                console.error("Error al actualizar cuotas pagadas:", error);
                toast.error('Error al actualizar cuotas');
            }
        } else {
            toast.error('Por favor, selecciona un valor de cuotas válido');
        }
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirige al usuario al login
    };
    const [isMobile, setIsMobile] = useState(false);




    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1300) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Llamamos a la función al cargar el componente

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const calcular2 = (e) => {
        e.preventDefault();

        // Obtener los valores de los inputs
        let monto = parseInt(document.getElementById("formMonto").value);
        let intereses = parseInt(document.getElementById("formIntereses").value);
        let semanas = parseInt(document.getElementById("formSemanas").value);

        // Calcular monto final, monto adeudado y cuotas totales
        let montoFinal = formData.soloInteres ? monto * (intereses / 100) : monto + monto * (intereses / 100);
        let montoAdeudado = (parseInt(document.getElementById("formSemanaPaga").value) * (montoFinal / semanas));
        let cuotasTotales = semanas;

        // Mostrar los resultados en los inputs correspondientes
        document.getElementById("formDevuelve").value = montoFinal;
        document.getElementById("formSemanaPaga").value = montoFinal / semanas;

        // Almacenar estos valores en el estado o enviarlos a la base de datos al crear el préstamo
        const nuevoPrestamo = {
            montoFinal: formData.soloInteres ? 0 : montoFinal,
            montoAdeudado: montoAdeudado,
            cuotasTotales: cuotasTotales,
            monto: monto,
            intereses: intereses,
            semanas: semanas,
        };

        // Crear préstamo
        crearPrestamo(nuevoPrestamo);
    };
    const crearPrestamo = async (nuevoPrestamo) => {
        if (clienteSeleccionado && clienteSeleccionado.dni) {
            try {
                const response = await fetch(`https://sistemafinanciero.up.railway.app/api/clientes/${clienteSeleccionado.dni}/prestamo/nuevo`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prestamoActual: nuevoPrestamo, // Asigna el nuevo préstamo
                        moverHistorial: true // Indica que se debe mover el préstamo actual al historial
                    })
                });

                if (response.status === 200) {
                    const clienteActualizado = await response.json();
                    setClienteSeleccionado(clienteActualizado);
                    toast.success("Préstamo creado y actualizado correctamente");
                    fetchClientes();
                    toggleOpen2();
                } else {
                    throw new Error("Error al crear el préstamo.");
                }
            } catch (error) {
                console.error("Error al crear el préstamo:", error);
                toast.error("Hubo un problema al crear el préstamo.");
            }
        } else {
            toast.error("Por favor, selecciona un cliente válido.");
        }
    };
    return (
        <>{/* NAVBAR MOVIL (Visible en pantallas pequeñas) */}
            {isMobile && (
                <div className="navbar-mobile">
                    <MDBBtn onClick={() => setIsGestionClientesOpen(!isGestionClientesOpen)} className="mobile-menu-btn" style={{ backgroundColor: '#15b1e5' }}>
                        <MDBIcon icon="bars" />
                    </MDBBtn>
                    {isGestionClientesOpen && (
                        <div className="dropdown-menu">
                            <MDBNavbarLink href="/panel" className="nav-item-link py-1">
                                <MDBIcon icon="table" className="me-2 mx-0" />
                                Tabla Clientes
                            </MDBNavbarLink>
                            <MDBNavbarLink href="/agregar-cliente" className="nav-item-link py-1">
                                <MDBIcon icon="user-plus" className="me-1 mx-0" />
                                Agregar Cliente
                            </MDBNavbarLink>
                            <MDBNavbarLink href="/eliminar-cliente" className="nav-item-link py-1">
                                <MDBIcon icon="user-times" className="me-1 mx-0" />
                                Eliminar Cliente
                            </MDBNavbarLink>
                            <MDBNavbarLink href="/modificar-cliente" className="nav-item-link py-1">
                                <MDBIcon icon="user-edit" className="me-1 mx-0" />
                                Modificar Cliente
                            </MDBNavbarLink>
                            <MDBNavbarLink href="/nuevo-cobro" className="nav-item-link py-1">
                                <MDBIcon icon="dollar-sign" className="me-2 mx-0 mt-2" />
                                Nuevo Cobro
                            </MDBNavbarLink>
                            <MDBNavbarLink href="/vendedores" className="nav-item-link py-1">
                                <MDBIcon fas icon="key" className="me-2 mx-0 mt-2" />
                                Vendedores
                            </MDBNavbarLink>
                            <MDBNavbarLink className="mt-4">
                                <MDBBtn color="danger" onClick={handleLogout}>
                                    <MDBIcon fas icon="sign-out-alt" className="me-2" style={{ fontSize: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Cerrar sesión</span>
                                </MDBBtn>
                            </MDBNavbarLink>
                        </div>
                    )}
                </div>
            )}

            <MDBContainer fluid className='col-10' id="container">
                <Toaster position="top-center" reverseOrder={false} />
                <MDBCard className="row" id="color">
                    <div className="row p-0" id="color">

                        {/* NAVBAR */}
                        {/* NAVBAR ORIGINAL (Visible en pantallas grandes) */}
                        {!isMobile && (
                            <div className="col-2 text-center" id="nav">
                                <h5 className="mt-4 text-center mb-5 admintitulo">Administración</h5>
                                <MDBNavbarNav>
                                    <MDBNavbarLink active aria-current="page" href="/panel" className="aaa nav-item-link">
                                        <MDBIcon icon="table" className="me-2 mx-0" />
                                        Tabla Clientes
                                    </MDBNavbarLink>
                                    <MDBNavbarLink href="#" onClick={toggleGestionClientes} className="nav-item-link">
                                        <MDBIcon icon="user-cog" className="me-1 mx-0 mover mt-2" />
                                        Registro Clientes
                                        <MDBIcon icon={isGestionClientesOpen ? 'angle-up' : 'angle-down'} className="" />
                                    </MDBNavbarLink>
                                    {isGestionClientesOpen && (
                                        <div className="submenu">
                                            <MDBNavbarLink href="/agregar-cliente" className="nav-item-link">
                                                <MDBIcon icon="user-plus" className="me-1 mx-0" />
                                                Agregar Cliente
                                            </MDBNavbarLink>
                                            <MDBNavbarLink href="/eliminar-cliente" className="nav-item-link">
                                                <MDBIcon icon="user-times" className="me-1 mx-0" />
                                                Eliminar Cliente
                                            </MDBNavbarLink>
                                            <MDBNavbarLink href="/modificar-cliente" className="nav-item-link">
                                                <MDBIcon icon="user-edit" className="me-1 mx-0" />
                                                Modificar Cliente
                                            </MDBNavbarLink>
                                        </div>
                                    )}
                                    <MDBNavbarLink href="/nuevo-cobro" className="nav-item-link">
                                        <MDBIcon icon="dollar-sign" className="me-2 mx-0 mt-2" />
                                        Nuevo Cobro
                                    </MDBNavbarLink>
                                    <MDBNavbarLink href="/vendedores" className="nav-item-link">
                                        <MDBIcon fas icon="key" className="me-2 mx-0 mt-2" />
                                        Vendedores
                                    </MDBNavbarLink>
                                    <MDBNavbarLink className="mt-4">
                                        <MDBBtn color="danger" onClick={handleLogout}>
                                            <MDBIcon fas icon="sign-out-alt" className="me-2" style={{ fontSize: '16px' }} />
                                            <span style={{ fontSize: '14px', fontWeight: '500' }}>Cerrar sesión</span>
                                        </MDBBtn>
                                    </MDBNavbarLink>
                                </MDBNavbarNav>
                            </div>
                        )}


                        {/* FIN DEL NAVBAR  */}

                        {/* PANEL ZONA */}
                        <div className="col-md-12 col-lg-10 p-0" id="panel">
                            <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
                            <h3 className="px-4 textogris mt-5 mx-1"><b>Nuevo Cobro</b></h3>

                            {/* TABLA */}
                            <div className="mx-4 mt-4 scrollable-content2">
                                <MDBTable id="tabla" className="shadow-3 mx-2 rounded-5 text-center">
                                    <MDBTableHead>
                                        <tr>
                                            <th scope='col'>Nombre</th>
                                            <th scope='col'>DNI</th>
                                            <th scope='col'>Fecha Inicio</th>
                                            <th scope='col'>Cuotas</th>
                                            <th scope='col'>Cuotas Pagadas</th>
                                            <th scope='col'>Mas Info</th>
                                            <th scope='col'></th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {clientes.map(cliente => (
                                            <tr key={cliente.dni}>
                                                <td>{cliente.nombre} <br />{cliente.apellido}</td>
                                                <td>{cliente.dni}</td>
                                                <td>{cliente.prestamoActual.fechaInicio}</td>
                                                <td>{cliente.prestamoActual.cuotasTotales}</td>
                                                <td>{cliente.prestamoActual.cuotasPagadas}</td>
                                                <td>
                                                    <MDBBtn color='info' size='sm' onClick={() => toggleOpen(cliente)}>
                                                        <MDBIcon icon="plus" className="" />
                                                    </MDBBtn>
                                                </td>
                                                <td>
                                                    {cliente.prestamoActual.cuotasPagadas === cliente.prestamoActual.cuotasTotales && (

                                                        <MDBBtn color='success' size='sm' onClick={() => toggleOpen2(cliente)}>
                                                            <MDBIcon icon="dollar-sign" className="me-2" />
                                                            Nuevo Prestamo
                                                        </MDBBtn>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>
                    </div>
                </MDBCard>

                {/* <MODAL></MODAL> */}
                <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                    <MDBModalDialog size="xl">
                        <MDBModalContent>
                            {/* FORMULARIO */}

                            <div className="rounded-5 shadow-3 p-4 row" id="formulario">
                                <MDBModalHeader className="mb-4">
                                    <h2 className=""><b>Nuevo Cobro</b></h2>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                                </MDBModalHeader>
                                <div className="col-lg-5 col-md-12 text-center">
                                    <h3 className="text-center text-muted mb-3">Cliente</h3>
                                    <ul>
                                        <li className="p-1"><b className="pe-2 azul">Nombre:</b>{clienteSeleccionado.nombre || ''} {clienteSeleccionado.apellido || ''}</li>
                                        <li className="p-1"><b className="pe-2 azul">DNI:</b> {clienteSeleccionado.dni || ''}</li>
                                    </ul>
                                </div>

                                <div className="col-lg-7 col-md-12 row text-center">
                                    <h3 className="text-center text-muted mb-3">Prestamo</h3>
                                    <div className="col-5">
                                        <ul>
                                            <li className="p-1"><b className="pe-2 azul">Fecha Inicio:</b> {clienteSeleccionado.prestamoActual?.fechaInicio || ''}</li>
                                            <li className="p-1"><b className="pe-2 azul">Monto Prestado:</b> {clienteSeleccionado.prestamoActual?.monto || ''}</li>
                                            <li className="p-1"><b className="pe-2 azul">Monto Pagado:</b> {montoAdeudadofunicion()}</li>
                                        </ul>
                                    </div>
                                    <div className="col-5">
                                        <ul>
                                            <li className="p-1"><b className="pe-2 azul">Intereses:</b> {clienteSeleccionado.prestamoActual?.intereses || ''}%</li>
                                            <li className="p-1"><b className="pe-2 azul">Monto Devule:</b> {clienteSeleccionado.prestamoActual?.montoFinal || ''}</li>
                                            <li className="p-1"><b className="pe-2 azul">Monto Faltante:</b> {calcularMontoFaltante()}</li>
                                            <li className="p-1"><b className="pe-2 azul">Vendedor:</b> {clienteSeleccionado.prestamoActual?.vendedor}</li>

                                        </ul>
                                    </div>
                                </div>

                                <div className="col-lg-5 col-md-12 text-center row">
                                    <h3 className="text-center text-muted mb-3">Historial de Préstamos</h3>
                                    <div className="scrollable-content row">
                                        {clienteSeleccionado.historialPrestamos?.length > 0 ? (
                                            clienteSeleccionado.historialPrestamos.map((prestamo, index) => (
                                                <React.Fragment key={index} className="mb-4">
                                                    <h6>Préstamo {index + 1}</h6>
                                                    <div className="col-6">
                                                        <ul>
                                                            <li className="p-1"><b className="pe-2 azul">Fecha Inicio:</b> {prestamo.fechaInicio}</li>
                                                            <li className="p-1"><b className="pe-2 azul">Monto Prestado:</b> {prestamo.monto}</li>
                                                            <li className="p-1"><b className="pe-2 azul">Monto Devuelto:</b> {prestamo.montoFinal}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-6">
                                                        <ul>
                                                            <li className="p-1"><b className="pe-2 azul">Intereses:</b> {prestamo.intereses}%</li>
                                                            <li className="p-1"><b className="pe-2 azul">Cuotas:</b> {prestamo.cuotasTotales}</li>
                                                            <li className="p-1"><b className="pe-2 azul">Vendedor:</b> {prestamo.vendedor}</li>
                                                        </ul>
                                                    </div>
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <p>No hay historial de préstamos disponible.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-12 text-center pt-3 row mb-4">
                                    <h5 className="text-muted text-center">
                                        Cuotas
                                    </h5>
                                    <div className="col-5">
                                        <ul>
                                            <li className="p-1"><b className="pe-2 azul">Cuotas:</b> {clienteSeleccionado.prestamoActual?.cuotasTotales || ''}</li>
                                            <li className="p-1">

                                                <select id="cuotaspagadas" className="form-select mb-4" value={cuotasPagadas} onChange={handleCuotasChange}>
                                                    {[...Array(clienteSeleccionado.prestamoActual?.cuotasTotales + 1 || 1)].map((_, index) => (
                                                        <option key={index} value={index} id={cuotaspagadas}>
                                                            {index} Cuotas Pagadas
                                                        </option>
                                                    ))}
                                                </select>
                                                <MDBIcon icon="save" size="lg" onClick={actualizarCuotasPagadas} style={{ cursor: 'pointer', color: 'green' }} />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-5">
                                        <ul>
                                            <li className="p-1"><b className="pe-2 azul">Semanas:</b> {clienteSeleccionado.prestamoActual?.semanas || ''}</li>
                                            <li className="p-1"><b className="pe-2 azul">Cuotas Faltantes:</b> {calcularCuotasFaltantes()}</li>

                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>



                {/* modal2 */}
                <MDBModal open={basicModal2} onClose={() => setBasicModal2(false)} tabIndex='-1'>
                    <MDBModalDialog size="md">
                        <MDBModalContent>



                            {/* FORMULARIO */}
                            <div className="rounded-5 shadow-3 p-4 row" id="formulario">
                                <MDBModalHeader className="mb-4">
                                    <h2 className=""><b>Nuevo Prestamo</b></h2>
                                    <MDBBtn className='btn-close' color='none' onClick={toggleOpen2}></MDBBtn>
                                </MDBModalHeader>
                                <div className="col-12">
                                    <h3 className="text-center text-muted mb-3">Prestamo</h3>
                                    <MDBRow>
                                        <div>
                                            <CustomInput label='Vendedor' id='formVendedor' type='text' />
                                        </div>
                                        <MDBCol col='3'>
                                            <CustomInput label='Monto' id='formMonto' type='number' />
                                        </MDBCol>
                                        <MDBCol col='3'>
                                            <CustomInput label='%Intereses' id='formIntereses' type='number' />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol col='3'>
                                            <CustomInput label='Fecha Inicio' id='formFecha' type='date' />
                                        </MDBCol>

                                        {/* Select de Semanas */}
                                        <MDBCol col='3'>
                                            <select id="formSemanas" className="form-select mb-4">
                                                <option value={1}>1 Semana</option>
                                                <option value={2}>2 Semanas</option>
                                                <option value={3}>3 Semanas</option>
                                                <option value={4}>4 Semanas</option>
                                                <option value={5}>5 Semanas</option>
                                                <option value={6}>6 Semanas</option>
                                                <option value={7}>7 Semanas</option>
                                                <option value={8}>8 Semanas</option>
                                                <option value={9}>9 Semanas</option>
                                                <option value={10}>10 Semanas</option>
                                                <option value={11}>11 Semanas</option>
                                                <option value={12}>12 Semanas</option>


                                            </select>
                                        </MDBCol>
                                    </MDBRow>
                                    <div className="mb-4">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="soloIntereses"
                                                checked={formData.soloIntereses}
                                                onChange={(e) => setFormData({ ...formData, soloIntereses: e.target.checked })}
                                            />
                                            <span className="ms-2">Solo intereses</span>
                                        </label>
                                    </div>

                                    <MDBRow className="">
                                        <MDBCol col='3'>
                                            <MDBInput label="Monto Final" id="formDevuelve" value={" "} type="text" disabled />
                                        </MDBCol>
                                        <MDBCol col='3'>
                                            <MDBInput label="Por Semana paga:" value={" "} id="formSemanaPaga" type="text" disabled />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol className="text-center">
                                            <MDBBtn className='w-90 col-6 mt-3' href='/error' size='md' color="dark" onClick={calcular}>Calcular intereses</MDBBtn>
                                        </MDBCol>
                                    </MDBRow>
                                </div>

                                <div className="col-12 mt-3">
                                    <MDBBtn className='w-100 mb-4 mt-4' color="success" onClick={() => {
                                        const monto = parseInt(document.getElementById("formMonto").value);
                                        const semanas = parseInt(document.getElementById("formSemanas").value);
                                        const intereses = parseInt(document.getElementById("formIntereses").value);
                                        const vendedor = document.getElementById("formVendedor").value;
                                        const fecha = document.getElementById("formFecha").value;
                                        // Calcular montoFinal, montoAdeudado y cuotasTotales
                                        const montoFinal = formData.soloInteres ? monto * (intereses / 100) : monto + monto * (intereses / 100);
                                        //const montoAdeudado = 0 * (montoFinal / semanas); // Suponiendo que cuotasPagadas inicia en 0
                                        const cuotasTotales = semanas;

                                        const nuevoPrestamo = {
                                            monto: monto,
                                            semanas: semanas,
                                            intereses: intereses,
                                            fechaInicio: fecha,
                                            cuotasPagadas: 0, // Inicialmente en 0
                                            montoFinal: montoFinal,
                                            vendedor: vendedor,
                                            montoAdeudado: formData.soloInteres ? 0 : montoFinal,
                                            cuotasTotales: cuotasTotales
                                        };

                                        crearPrestamo(nuevoPrestamo);
                                    }}>
                                        Crear Préstamo
                                    </MDBBtn>
                                </div>
                            </div>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </MDBContainer >
        </>
    );
}
