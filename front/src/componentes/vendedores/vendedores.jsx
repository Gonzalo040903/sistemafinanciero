import "./vendedores.css";
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



export function Vendedores() {

    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const [basicModal2, setBasicModal2] = useState(false);
    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleOpen2 = () => setBasicModal2(!basicModal2);
    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };


    const CustomInput = ({ label, type, id, value, onChange }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} value={value} onChange={onChange} />
    );
    let palabra = "Panel de control > Vendedores";



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
                        <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
                        <h3 className="px-4 textogris mt-5 mx-1"><b>Vendedores <MDBBtn size="sm" color="outline-success" id="iconoplus" onClick={toggleOpen}> <MDBIcon icon="plus" className="" size="md" color="success" /></MDBBtn></b></h3>

                        {/* TABLA */}
                        <MDBTable id="tabla" className="shadow-3 rounded-5 mx-4 mt-4 text-center">
                            <MDBTableHead>
                                <tr>
                                    <th scope='col'>Nombre</th>
                                    <th scope='col'>Apellido</th>
                                    <th scope='col'></th>
                                    <th scope='col'></th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                <tr>
                                    <td>Gonzalo</td>
                                    <td>Manzano</td>
                                    <td>
                                        <MDBBtn color='warning' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Modificar
                                        </MDBBtn>
                                    </td>
                                    <td>
                                        <MDBBtn color='danger' size='sm'>
                                            <MDBIcon icon="times" className="me-2" />
                                            Eliminar
                                        </MDBBtn>
                                    </td>

                                </tr>
                                <tr>
                                    <td>Josefina</td>
                                    <td>Medina</td>
                                    <td>
                                        <MDBBtn color='warning' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Modificar
                                        </MDBBtn>
                                    </td>
                                    <td>
                                        <MDBBtn color='danger' size='sm'>
                                            <MDBIcon icon="times" className="me-2" />
                                            Eliminar
                                        </MDBBtn>
                                    </td>

                                </tr>
                                <tr>
                                    <td>Solana</td>
                                    <td>Heredia</td>
                                    <td>
                                        <MDBBtn color='warning' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Modificar
                                        </MDBBtn>
                                    </td>
                                    <td>
                                        <MDBBtn color='danger' size='sm'>
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
            {/* MODAL */}
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                <MDBModalDialog size="md">
                    <MDBModalContent>



                        {/* FORMULARIO */}
                        <div className="rounded-5 shadow-3 p-4 row" id="formulario">
                            <MDBModalHeader className="mb-4">
                                <h2 className=""><b>Nuevo Vendedor</b></h2>
                                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                            </MDBModalHeader>
                            <div className="col-10 my-3">
                                <MDBRow>
                                    <CustomInput label='Nombres' id='formNombre' type='text' />
                                    <CustomInput label='Apellidos' id='formApellido' type='text' />
                                    <MDBBtn className='w-100 mb-4' href='/error' color="success" size='md'>Crear Vendedor</MDBBtn>
                                </MDBRow>
                            </div>



                        </div>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

        </MDBContainer >
    )
}