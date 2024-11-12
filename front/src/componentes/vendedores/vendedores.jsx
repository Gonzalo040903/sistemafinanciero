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
    MDBModalTitle,
    MDBModalBody,
    MDBModalContent,
    MDBModalFooter
} from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export function Vendedores() {
    const [optSmModal, setOptSmModal] = useState(false);
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const [basicModal3, setBasicModal3] = useState(false);
    const [vendedores, setVendedores] = useState([]);
    const [vendedorAEliminar, setVendedorAEliminar] = useState(null);

    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };
    const toggleOpen3 = () => setBasicModal3(!basicModal3);
    const toggleOpen2 = () => setOptSmModal(!optSmModal);
    const toggleOpen = () => setBasicModal(!basicModal);

    const CustomInput = ({ label, type, id, value, onChange }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} value={value} onChange={onChange} />
    );

    const traerVendedores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/vendedores', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setVendedores(response.data);
        } catch (error) {
            console.error("Error al traer los vendedores:", error);
            toast.error("Error al cargar los vendedores");
        }
    };

    const agregarVendedor = async () => {
        const nombre = document.getElementById('formNombre').value;
        const contraseña = document.getElementById('formContraseña').value;
        const rol = 'vendedor'; // Asignar automáticamente el rol de 'vendedor'

        if (!nombre || !contraseña) {
            toast.error('Por favor, complete todos los campos.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3001/api/vendedores', {
                nombre,
                contraseña,
                rol
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success(response.data.message);
            setBasicModal(false); // Cerrar el modal después de crear el vendedor
            traerVendedores(); // Recargar la lista de vendedores
        } catch (error) {
            toast.error("Error al crear el vendedor");
            console.error(error);
        }
    };


    const eliminarVendedor = async () => {
        if (!vendedorAEliminar) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3001/api/vendedores/${vendedorAEliminar._id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });

            toast.success(response.data.message);
            setOptSmModal(false); // Cerrar el modal después de eliminar el vendedor
            traerVendedores();
            setVendedorAEliminar(null); // Recargar la lista de vendedores
        } catch (error) {
            toast.error("Error al eliminar el vendedor");
            console.error(error);
        }
    };

    useEffect(() => {
        traerVendedores();
    }, []);

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
                                    <th scope='col'>Contraseña</th>
                                    <th scope='col'></th>
                                    <th scope='col'></th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {vendedores.map((vendedor) => (
                                    <tr key={vendedor._id}>
                                        <td>{vendedor.nombre}</td>
                                        <td>{vendedor.contraseña}</td>
                                        <td>
                                            <MDBBtn color='warning' size='sm' onClick={toggleOpen3}>
                                                <MDBIcon icon="pencil-alt" className="me-2" />
                                                Modificar
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            <MDBBtn color='danger' size='sm' onClick={() => {
                                                setVendedorAEliminar(vendedor); // Asignar el vendedor a eliminar
                                                toggleOpen2();
                                            }}>
                                                <MDBIcon icon="times" className="me-2" />
                                                Eliminar
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                </div>
            </MDBCard>

            {/* MODAL NUEVO VENDEDOR*/}
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
                                    <CustomInput label='Nombre' id='formNombre' type='text' />
                                    <CustomInput label='Contraseña' id='formContraseña' type='password' />
                                    <MDBBtn className='w-100 mb-4' color="success" size='md' onClick={agregarVendedor}>Crear Vendedor</MDBBtn>
                                </MDBRow>
                            </div>
                        </div>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* MODAL Modificar*/}
            <MDBModal open={basicModal3} onClose={() => setBasicModal3(false)} tabIndex='-1'>
                <MDBModalDialog size="md">
                    <MDBModalContent>
                        {/* FORMULARIO */}
                        <div className="rounded-5 shadow-3 p-4 row" id="formulario">
                            <MDBModalHeader className="mb-4">
                                <h2 className=""><b>Modificar Vendedor</b></h2>
                                <MDBBtn className='btn-close' color='none' onClick={toggleOpen3}></MDBBtn>
                            </MDBModalHeader>
                            <div className="col-10 my-3">
                                <MDBRow>
                                    <CustomInput label='Nombre' id='formNombre' type='text' />
                                    <CustomInput label='Contraseña' id='formContraseña' type='password' />
                                    <MDBBtn className='w-100 mb-4' href='/error' color="warning" size='md'>Modificar Vendedor</MDBBtn>
                                </MDBRow>
                            </div>
                        </div>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* modal eliminar */}
            <MDBModal open={optSmModal} tabIndex='-1' onClose={() => setOptSmModal(false)}>
                <MDBModalDialog size='md'>
                    <MDBModalContent>
                        <MDBModalHeader className="bg-danger text-center">
                            <MDBModalTitle className="text-light m-auto">¿Estas Seguro?</MDBModalTitle>
                        </MDBModalHeader>
                        <MDBModalBody className="text-center">
                            <MDBIcon icon="times" className="me-2 text-danger iconogrande" /><br />
                            Desea eliminar el Vendedor de nombre <b>{vendedorAEliminar?.nombre}</b>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='danger' onClick={eliminarVendedor}>
                                Si
                            </MDBBtn>
                            <MDBBtn color="info" onClick={toggleOpen2}>
                                Cancelar
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer>
    );
}