import "./eliminarclienteStyle.css";
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
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter
} from 'mdb-react-ui-kit';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export function Eliminarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [optSmModal, setOptSmModal] = useState(false);
    const funcionSuccess = (e) => {
        e.preventDefault();
        toast.success('Cliente Eliminado');
        toggleOpen()
    };
    const toggleOpen = () => setOptSmModal(!optSmModal);
    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };

    let palabra = "Panel de control > Registro Clientes > Eliminar Cliente";

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
                        <h3 className="px-4 textogris mt-5 mx-1"><b>Eliminar Clientes</b></h3>

                        {/* TABLA */}
                        <MDBTable id="tabla" className="shadow-3 rounded-5 mx-4 mt-4 text-center">
                            <MDBTableHead>
                                <tr>
                                    <th scope='col'>Nombre</th>
                                    <th scope='col'>DNI</th>
                                    <th scope='col'>Direccion</th>
                                    <th scope='col'>Telefono</th>
                                    <th scope='col'>Telefono 2</th>
                                    <th scope='col'>Accion</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>12345678</td>
                                    <td>1234 Elm St</td>
                                    <td>555-1234</td>
                                    <td>555-5678</td>
                                    <td>
                                        <MDBBtn color='danger' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="times" className="me-2" />
                                            Eliminar
                                        </MDBBtn>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alex Ray</td>
                                    <td>87654321</td>
                                    <td>av belrnao 1200</td>
                                    <td>555-5678</td>
                                    <td>555-1234</td>
                                    <td>
                                        <MDBBtn color='danger' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="times" className="me-2" />
                                            Eliminar
                                        </MDBBtn>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Kate Hunington</td>
                                    <td>45678912</td>
                                    <td>910 Maple Ave</td>
                                    <td>555-9101</td>
                                    <td>555-1112</td>
                                    <td>
                                        <MDBBtn color='danger' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="times" className="me-2" />
                                            Eliminar
                                        </MDBBtn>
                                    </td>
                                </tr>
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                </div>
            </MDBCard>

            <MDBModal open={optSmModal} tabIndex='-1' onClose={() => setOptSmModal(false)}>
                <MDBModalDialog size='sm'>
                    <MDBModalContent>
                        <MDBModalHeader className="bg-danger text-center">
                            <MDBModalTitle className="text-light m-auto">¿Estas Seguro?</MDBModalTitle>
                        </MDBModalHeader>
                        <MDBModalBody className="text-center">
                            <MDBIcon icon="times" className="me-2 text-danger iconogrande" /><br />
                            Desea eliminar "nombre de cliente"
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='danger' onClick={funcionSuccess}>
                                Si
                            </MDBBtn>
                            <MDBBtn color="info" onClick={toggleOpen}>
                                cancelar
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer>


    );
}
