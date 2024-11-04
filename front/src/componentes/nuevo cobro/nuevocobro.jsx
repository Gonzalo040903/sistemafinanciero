import "./nuevocobro.css";
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
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export function Nuevocobro() {
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
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };
    const nombreCliente = "ramon ignacio martinez"
    const funcionSuccess = (e) => {
        e.preventDefault();
        toast.success('Cliente Modificado')
        toggleOpen()
    }

    const CustomInput = ({ label, type, id, value, onChange }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} value={value} onChange={onChange} />
    );
    let palabra = "Panel de control > Nuevo Cobro";

    return (
        <MDBContainer fluid className='col-10' id="container">
            <Toaster position="top-center" reverseOrder={false} />
            <MDBCard className="row" id="color">
                <div className="row p-0" id="color">
                    <div className="col-2 text-center" id="nav">
                        <h5 className="mt-4 text-center mb-5 admintitulo">Administracion</h5>
                        <MDBNavbarNav>
                            <MDBNavbarLink active aria-current='page' href='#' className="aaa nav-item-link">
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
                                        <MDBNavbarLink href='#' className="nav-item-link">
                                            <MDBIcon icon="user-plus" className="me-1 mx-0" />
                                            Agregar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='#' className="nav-item-link">
                                            <MDBIcon icon="user-times" className="me-1 mx-0" />
                                            Eliminar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='#' className="nav-item-link">
                                            <MDBIcon icon="user-edit" className="me-1 mx-0" />
                                            Modificar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                </div>
                            )}
                            <MDBNavbarLink href='#' className="nav-item-link">
                                <MDBIcon icon="dollar-sign" className="me-2 mx-0 mt-2" />
                                Nuevo Cobro
                            </MDBNavbarLink>
                        </MDBNavbarNav>
                    </div>

                    {/* PANEL ZONA */}
                    <div className="col-10 p-0" id="panel">
                        <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
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
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>12345678</td>
                                    <td>31/12/2024</td>
                                    <td>12</td>
                                    <td>6</td>
                                    <td>
                                        <MDBBtn color='info' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Mas Info
                                        </MDBBtn>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alex Ray</td>
                                    <td>87654321</td>
                                    <td>12/11/2023</td>
                                    <td>11</td>
                                    <td>11</td>
                                    <td>
                                        <MDBBtn color='info' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Mas Info
                                        </MDBBtn>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Kate Hunington</td>
                                    <td>45678912</td>
                                    <td>04/09/2024</td>
                                    <td>3</td>
                                    <td>0</td>
                                    <td>
                                        <MDBBtn color='info' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Mas Info
                                        </MDBBtn>
                                    </td>
                                </tr>
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
                                    <li className="p-1"><b className="pe-2">Nombre:</b> {nombreCliente}</li>
                                    <li className="p-1"><b className="pe-2">DNI:</b> 44989031</li>
                                </ul>
                            </div>
                            <div className="col-8 row text-center">
                                <h3 className="text-center text-muted mb-3">Prestamo</h3>
                                <div className="col-5">
                                    <ul>
                                        <li className="p-1"><b className="pe-2">Fecha Inicio:</b> 12/12/2025</li>
                                        <li className="p-1"><b className="pe-2">Monto Prestado:</b> 100.000</li>
                                        <li className="p-1"><b className="pe-2">Monto Pagado:</b> 75.000</li>
                                    </ul>
                                </div>
                                <div className="col-5">
                                    <ul>
                                        <li className="p-1"><b className="pe-2">Intereses:</b> 15%</li>
                                        <li className="p-1"><b className="pe-2">Monto Devule:</b> 115.000</li>
                                        <li className="p-1"><b className="pe-2">Monto Faltante:</b> 50.000</li>

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
                                        <li className="p-1"><b className="pe-2">Cuotas:</b> 12</li>
                                        <li className="p-1"><b className="pe-2">Cuotas Pagadas:</b> 7</li>
                                    </ul>
                                </div>
                                <div className="col-5">
                                    <ul>
                                        <li className="p-1"><b className="pe-2">Semanas:</b> 12</li>
                                        <li className="p-1"><b className="pe-2">Cuotas Faltantes:</b> 5</li>

                                    </ul>
                                </div>
                            </div>
                        </div>

                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer >
    );
}
