import "./panelControl.css";
import {
    MDBContainer,
    MDBCard,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBIcon,
    MDBBadge,
    MDBTable,
    MDBTableHead,
    MDBTableBody
} from 'mdb-react-ui-kit';
import { useState } from 'react';

export function PanelControl() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);

    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };

    let palabra = "Panel de control > Tabla Clientes";

    return (
        <MDBContainer fluid className='col-10' id="container">
            <MDBCard className="row" id="color">
                <div className="row p-0" id="color">
                    <div className="col-2" id="nav">
                        <h5 className="mt-4 mx-4 mb-4">Administracion</h5>
                        <MDBNavbarNav>
                            <MDBNavbarLink active aria-current='page' href='#'>
                                <MDBIcon icon="table" className="me-2 mx-3" />
                                Tabla Clientes
                            </MDBNavbarLink>
                            <MDBNavbarLink href='#' onClick={toggleGestionClientes}>
                                <MDBIcon icon="user-cog" className="me-2 mx-3" />
                                Gestion Clientes
                                <MDBIcon icon={isGestionClientesOpen ? 'angle-up' : 'angle-down'} className='ms-2' />
                            </MDBNavbarLink>
                            {isGestionClientesOpen && (
                                <div className="submenu">
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='#'>
                                            <MDBIcon icon="user-plus" className="me-2 mx-3" />
                                            Agregar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='#'>
                                            <MDBIcon icon="user-times" className="me-2 mx-3" />
                                            Eliminar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink href='#'>
                                            <MDBIcon icon="user-edit" className="me-2 mx-3" />
                                            Modificar Cliente
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                </div>
                            )}
                            <MDBNavbarLink href='#'>
                                <MDBIcon icon="dollar-sign" className="me-2 mx-3" />
                                Nuevo Cobro
                            </MDBNavbarLink>
                        </MDBNavbarNav>
                    </div>

                    {/* PANEL ZONA */}
                    <div className="col-10 p-0" id="panel">
                        <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
                        <h3 className="px-4 textogris mt-5"><b>Tabla Clientes</b></h3>

                        {/* TABLA */}
                        <MDBTable align='middle' id="tabla" className="shadow-3 rounded-5 mx-4 mt-4">
                            <MDBTableHead>
                                <tr>
                                    <th scope='col'>Nombre</th>
                                    <th scope='col'>DNI</th>
                                    <th scope='col'>Email</th>
                                    <th scope='col'>Direccion</th>
                                    <th scope='col'>Telefono</th>
                                    <th scope='col'>Estado</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>12345678</td>
                                    <td>john.doe@gmail.com</td>
                                    <td>1234 Elm St</td>
                                    <td>555-1234</td>
                                    <td>
                                        <MDBBadge color='warning' pill>
                                            Pendiente
                                        </MDBBadge>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alex Ray</td>
                                    <td>87654321</td>
                                    <td>alex.ray@gmail.com</td>
                                    <td>5678 Oak St</td>
                                    <td>555-5678</td>
                                    <td>
                                        <MDBBadge color='success' pill>
                                            Pago
                                        </MDBBadge>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Kate Hunington</td>
                                    <td>45678912</td>
                                    <td>kate.hunington@gmail.com</td>
                                    <td>910 Maple Ave</td>
                                    <td>555-9101</td>
                                    <td>
                                        <MDBBadge color='danger' pill>
                                            No Pago
                                        </MDBBadge>
                                    </td>
                                </tr>
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                </div>
            </MDBCard>
        </MDBContainer>
    );
}
