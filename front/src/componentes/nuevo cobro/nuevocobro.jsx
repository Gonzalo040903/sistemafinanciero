import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
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
    const CustomInput = ({ label, type, id, value, onChange }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} value={value} onChange={onChange} />
    );
    const calcular = (e) => {
        e.preventDefault();
        let monto = parseInt(document.getElementById("formMonto").value);
        let intereses = parseInt(document.getElementById("formIntereses").value);
        let montoFinal = (monto * intereses / 100) + monto
        let semana = parseInt(document.getElementById("formSemanas").value);
        let montoxsemana = montoFinal / semana;
        let semanapaga = document.getElementById("formSemanaPaga")
        let devuelve = document.getElementById("formDevuelve")
        if (monto && intereses) {
            semanapaga.value = montoxsemana;
            devuelve.value = montoFinal;
        }
    }
    const calcularMontoFaltante = () => {
        if (clienteSeleccionado && clienteSeleccionado.prestamoActual) {
            const cuotaValor = clienteSeleccionado.prestamoActual.montoFinal / clienteSeleccionado.prestamoActual.cuotasTotales;
            const cuotasRestantes = clienteSeleccionado.prestamoActual.cuotasTotales - clienteSeleccionado.prestamoActual.cuotasPagadas;
            return cuotaValor * cuotasRestantes;
        }
        return 0;
    };
    const funcionSuccess = (e) => {
        e.preventDefault();
        toast.success('Prestamo Creado')
        toggleOpen2()
    }
    const [clientes, setClientes] = useState([]);
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const [basicModal2, setBasicModal2] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState({}); // Inicializar con un objeto vacío

    const toggleOpen = (cliente) => {
        setClienteSeleccionado(cliente || {}); // Evitar nulos
        setBasicModal(!basicModal);
    };

    const toggleOpen2 = () => setBasicModal2(!basicModal2);
    const toggleGestionClientes = () => setIsGestionClientesOpen(!isGestionClientesOpen);

    // Función para obtener los datos de los clientes desde la API
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/clientes');
                setClientes(response.data);
            } catch (error) {
                console.error("Error al obtener los clientes:", error);
            }
        };
        fetchClientes();
    }, []);

    return (
        <MDBContainer fluid className='col-10' id="container">
            <Toaster position="top-center" reverseOrder={false} />
            <MDBCard className="row" id="color">
                <div className="row p-0" id="color">
                    <div className="col-2 text-center" id="nav">
                        <h5 className="mt-4 text-center mb-5 admintitulo">Administracion</h5>
                        <MDBNavbarNav>
                            <MDBNavbarLink active aria-current='page' href='/panel' className="aaa nav-item-link">
                                <MDBIcon icon="table" className="me-2 mx-0" />
                                Tabla Clientes
                            </MDBNavbarLink>
                            <MDBNavbarLink href='#' onClick={toggleGestionClientes} className="nav-item-link">
                                <MDBIcon icon="user-cog" className="me-1 mx-0 mover mt-2" />
                                Registro Clientes
                                <MDBIcon icon={isGestionClientesOpen ? 'angle-up' : 'angle-down'} className='' />
                            </MDBNavbarLink>
                            {isGestionClientesOpen && (
                                <div className="submenu">
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='/agregar-cliente' className="nav-item-link">
                                            <MDBIcon icon="user-plus" className="me-1 mx-0" />
                                            Agregar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='/eliminar-cliente' className="nav-item-link">
                                            <MDBIcon icon="user-times" className="me-1 mx-0" />
                                            Eliminar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='/modificar-cliente' className="nav-item-link">
                                            <MDBIcon icon="user-edit" className="me-1 mx-0" />
                                            Modificar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                </div>
                            )}
                            <MDBNavbarLink href='/nuevo-cobro' className="nav-item-link">
                                <MDBIcon icon="dollar-sign" className="me-2 mx-0 mt-2" />
                                Nuevo Cobro
                            </MDBNavbarLink>
                            <MDBNavbarLink href='/vendedores' className="nav-item-link">
                                <MDBIcon fas icon="key" className="me-2 mx-0 mt-2" />
                                Vendedores
                            </MDBNavbarLink>
                        </MDBNavbarNav>
                    </div>

                    {/* PANEL ZONA */}
                    <div className="col-10 p-0" id="panel">
                        <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">Panel de control > Nuevo Cobro</header>
                        <h3 className="px-4 textogris mt-5 mx-1"><b>Nuevo Cobro</b></h3>

                        {/* TABLA */}
                        <MDBTable id="tabla" className="shadow-3 rounded-5 mx-4 mt-4 text-center">
                            <MDBTableHead>
                                <tr>
                                    <th scope='col'>Nombre</th>
                                    <th scope='col'>DNI</th>
                                    <th scope='col'>Fecha Inicio</th>
                                    <th scope='col'>Cuotas</th>
                                    <th scope='col'>Cuotas Pagadas</th>
                                    <th scope='col'></th>
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
                                                <MDBIcon icon="pencil-alt" className="me-2" />
                                                Mas Info
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            <MDBBtn color='success' size='sm' onClick={toggleOpen2}>
                                                <MDBIcon icon="dollar-sign" className="me-2" />
                                                Nuevo Prestamo
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
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
                            <div className="col-4">
                                <h3 className="text-center text-muted mb-3">Cliente</h3>
                                <ul>
                                    <li className="p-1"><b className="pe-2">Nombre:</b>{clienteSeleccionado.nombre || ''} {clienteSeleccionado.apellido || ''}</li>
                                    <li className="p-1"><b className="pe-2">DNI:</b> {clienteSeleccionado.dni || ''}</li>
                                </ul>
                            </div>
                            <div className="col-8 row text-center">
                                <h3 className="text-center text-muted mb-3">Prestamo</h3>
                                <div className="col-5">
                                    <ul>
                                        <li className="p-1"><b className="pe-2">Fecha Inicio:</b> {clienteSeleccionado.prestamoActual?.fechaInicio || ''}</li>
                                        <li className="p-1"><b className="pe-2">Monto Prestado:</b> {clienteSeleccionado.prestamoActual?.monto || ''}</li>
                                        <li className="p-1"><b className="pe-2">Monto Pagado:</b> {clienteSeleccionado.prestamoActual?.montoPagado || '0'}</li>
                                    </ul>
                                </div>
                                <div className="col-5">
                                    <ul>
                                        <li className="p-1"><b className="pe-2">Intereses:</b> {clienteSeleccionado.prestamoActual?.intereses || ''}%</li>
                                        <li className="p-1"><b className="pe-2">Monto Devule:</b> {clienteSeleccionado.prestamoActual?.montoFinal || ''}</li>
                                        <li className="p-1"><b className="pe-2">Monto Faltante:</b> {calcularMontoFaltante()}</li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-4">
                            </div>
                            <div className="col-8 text-center pt-3 row mb-4">
                                <h5 className="text-muted text-center">
                                    Cuotas
                                </h5>
                                <div className="col-5">
                                    <ul>
                                        <li className="p-1"><b className="pe-2">Cuotas:</b> {clienteSeleccionado.prestamoActual?.cuotasTotales || ''}</li>
                                        <li className="p-1"><select id="cuotaspagadas" className="form-select mb-4">
                                            <option value={0}>0 Cuotas Pagadas</option>
                                            <option value={1}>1 Cuotas Pagadas</option>
                                            <option value={2}>2 Cuotas Pagadas</option>
                                            <option value={3}>3 Cuotas Pagadas</option>
                                            <option value={4}>4 Cuotas Pagadas</option>
                                            <option value={5}>5 Cuotas Pagadas</option>
                                            <option value={6}>6 Cuotas Pagadas</option>
                                            <option value={7}>7 Cuotas Pagadas</option>
                                            <option value={8}>8 Cuotas Pagadas</option>
                                            <option value={9}>9 Cuotas Pagadas</option>
                                            <option value={10}>10 Cuotas Pagadas</option>
                                            <option value={11}>11 Cuotas Pagadas</option>
                                            <option value={12}>12 Cuotas Pagadas</option>
                                        </select></li>
                                    </ul>
                                </div>
                                <div className="col-5">
                                    <ul>
                                        <li className="p-1"><b className="pe-2">Semanas:</b> {clienteSeleccionado.prestamoActual?.semanas || ''}</li>
                                        <li className="p-1"><b className="pe-2">Cuotas Faltantes:</b> {clienteSeleccionado.prestamoActual?.pagadas || '0'}</li>

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

                            <div className="col-8 mt-3">
                                <MDBBtn className='w-100 mb-4 mt-4' href='/error' color="success" size='md' onClick={funcionSuccess}>Crear Prestamo</MDBBtn>
                            </div>
                        </div>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer >
    );
}
