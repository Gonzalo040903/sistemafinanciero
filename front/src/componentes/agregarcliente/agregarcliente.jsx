import "./agregarcliente.css";
import {
    MDBContainer,
    MDBCard,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBIcon,
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBCardBody,
    MDBInput,
    MDBTypography,
} from 'mdb-react-ui-kit';
import { useState } from 'react';

export function Agregarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);

    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };

    const CustomInput = ({ label, type, id }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} />
    );


    let palabra = "Panel de control > Agregar Cliente";

    return (
        <MDBContainer fluid className='col-10' id="container">
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
                                Gestion Clientes
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
                        <h3 className="px-4 textogris mt-5 mx-1"><b>Agregar Cliente</b></h3>


                        {/* FORMULARIO */}
                        <div className="p-5 mx-4 mt-0 px-4 rounded-5 shadow-3 mb-4 row" id="formulario">

                            <div className="col-5">
                                <h3 className="text-center text-muted mb-3">Cliente</h3>
                                <MDBRow>
                                    <MDBCol col='3'>
                                        <CustomInput label='Nombres' id='formNombre' type='text' />
                                    </MDBCol>

                                    <MDBCol col='3'>
                                        <CustomInput label='Apellidos' id='formApellido' type='text' />
                                    </MDBCol>
                                </MDBRow>
                                <CustomInput label='DNI' id='formDni' type='number' />
                                <CustomInput label='Direccion' id='formDirec' type='text' />
                                <MDBRow>
                                    <MDBCol>
                                        <CustomInput label='Telefono' id='formTel' type='number' />
                                    </MDBCol>
                                    <MDBCol>
                                        <CustomInput label='Telefono 2' id='formTel2' type='number' />
                                    </MDBCol>
                                </MDBRow>

                            </div>
                            <div className="col-5">
                                <h3 className="text-center text-muted">Prestamo</h3>
                                <MDBRow>
                                    <MDBCol col='3'>
                                        <CustomInput label='Nombres' id='formFirstName' type='text' />
                                    </MDBCol>

                                    <MDBCol col='3'>
                                        <CustomInput label='Apellidos' id='formLastName' type='text' />
                                    </MDBCol>
                                </MDBRow>
                                <CustomInput label='Email' id='formEmail' type='email' />

                            </div>

                            <div className="col-6 mt-3">

                                <MDBBtn className='w-100' href='/error' size='md' style={{ backgroundColor: '#15b1e5' }}>Registrar Nuevo Usuario</MDBBtn>
                            </div>

                        </div>
                    </div>
                </div>
            </MDBCard>
        </MDBContainer>
    );
}
