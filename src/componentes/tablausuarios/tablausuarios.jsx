import "./panelControl.css";
import {
    MDBContainer,
    MDBCard,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBIcon
} from 'mdb-react-ui-kit';
import { useState } from 'react';

export function PanelControl() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);

    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };
    let palabra = "Panel de control > Tabla Clientes"
    return (
        <MDBContainer fluid className='col-10' id="container">
            <MDBCard className="row" id="color">
                <div className="row p-0" id="color">
                    <div className="col-3" id="nav">
                        <h3 className="mt-4 mx-4">Administracion</h3>
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
                    <div className="col-9 p-0" id="panel">
                        <header className="p-2 mx-5 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
                        <h3 className="px-5 textogris mt-4"><b>Tabla Clientes</b></h3>

                    </div>
                </div>
            </MDBCard>
        </MDBContainer>
    );
}
