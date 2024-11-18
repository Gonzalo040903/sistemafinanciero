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
    MDBModalFooter,
    MDBBadge
} from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export function Eliminarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [optSmModal, setOptSmModal] = useState(false);
    const [clienteEliminar, setClienteEliminar] = useState(null);  // Almacenar cliente con DNI, nombre y apellido
    const funcionSuccess = () => {
        toast.success('Cliente Eliminado');
        toggleOpen();
        // Vuelve a cargar los clientes después de eliminar uno
        fetchClientes();
    };

    const toggleOpen = () => setOptSmModal(!optSmModal);
    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };

    const [clientes, setClientes] = useState([]);

    const fetchClientes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const eliminarCliente = async (dni) => {
        try {
            await axios.delete(`http://localhost:3001/api/clientes/${dni}`);
            funcionSuccess();  // Llamar a la función de éxito después de la eliminación
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
        }
    };

    let palabra = "Panel de control > Registro Clientes > Eliminar Cliente";
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
                            <h3 className="px-4 textogris mt-5 mx-1"><b>Eliminar Clientes</b></h3>

                            {/* TABLA */}
                            <div className="mx-4 mt-4 scrollable-content2">
                                <MDBTable id="tabla" className="shadow-3 mx-2 rounded-5 text-center">
                                    <MDBTableHead>
                                        <tr>
                                            <th scope='col'>Nombre</th>
                                            <th scope='col'>DNI</th>
                                            <th scope='col'>Direccion</th>
                                            <th scope='col'>Telefono</th>
                                            <th scope='col'>Telefono2</th>
                                            <th scope='col'>Telefono3</th>
                                            <th scope='col'></th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {clientes.map((cliente) => (
                                            <tr key={cliente.dni}>
                                                <td>{cliente.nombre} {cliente.apellido}</td>
                                                <td>{cliente.dni}</td>
                                                <td>{cliente.direccion}</td>
                                                <td>{cliente.telefonoPersonal}</td>
                                                <td>{cliente.telefonoReferencia}</td>
                                                <td>{cliente.telefonoTres}</td>
                                                <td>
                                                    <MDBBtn color="danger" onClick={() => { setClienteEliminar(cliente); toggleOpen(); }}>
                                                        Eliminar
                                                    </MDBBtn>
                                                </td>
                                            </tr>
                                        ))}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>
                    </div>
                </MDBCard>

                <MDBModal open={optSmModal} tabIndex='-1' onClose={() => setOptSmModal(false)}>
                    <MDBModalDialog size='md'>
                        <MDBModalContent>
                            <MDBModalHeader className="bg-danger text-center">
                                <MDBModalTitle className="text-light m-auto">¿Estas Seguro?</MDBModalTitle>
                            </MDBModalHeader>
                            <MDBModalBody className="text-center">
                                <MDBIcon icon="times" className="me-2 text-danger iconogrande" /><br />
                                Desea eliminar el cliente con DNI {clienteEliminar?.dni} <br /> de nombre {clienteEliminar?.nombre} {clienteEliminar?.apellido}
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color='danger' onClick={() => eliminarCliente(clienteEliminar.dni)}>
                                    Si
                                </MDBBtn>
                                <MDBBtn color="info" onClick={toggleOpen}>
                                    Cancelar
                                </MDBBtn>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </MDBContainer>
        </>
    );
}
