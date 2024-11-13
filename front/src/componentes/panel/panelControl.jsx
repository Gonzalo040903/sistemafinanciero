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
    MDBTableBody,
    MDBBtn
} from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export function PanelControl() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();

    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirige al usuario al login
    };

    useEffect(() => {
        // Llamada a la API para obtener clientes
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

    let palabra = "Panel de control > Tabla Clientes";

    return (
        <MDBContainer fluid className='col-10' id="container">
            <MDBCard className="row" id="color">
                <div className="row p-0" id="color">
                    <div className="col-2 text-center" id="nav">
                        <h5 className="mt-4 text-center mb-5 admintitulo">Administración</h5>
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
                            </MDBNavbarLink >
                            <MDBNavbarLink href='/vendedores' className="nav-item-link">
                                <MDBIcon fas icon="key" className="me-2 mx-0 mt-2" />
                                Vendedores
                            </MDBNavbarLink>
                        </MDBNavbarNav>
                        {/* Botón de cerrar sesión */}
                        <MDBBtn 
                            color="none" 
                            className="mt-4" 
                            style={{
                                backgroundColor: '#D9534F', // Fondo rojo suave
                                color: 'white', // Texto blanco para contraste
                                border: '1px solid #D9534F', // Borde sutil del mismo color del fondo
                                borderRadius: '25px', 
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                textTransform: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: 'none',
                                textDecoration: 'none'
                            }} 
                            onClick={handleLogout}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#C9302C'; // Rojo más intenso al pasar el mouse
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#D9534F'; // Rojo suave
                            }}
                        >
                            <MDBIcon fas icon="sign-out-alt" className="me-2" style={{ fontSize: '16px' }} />
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>Cerrar sesión</span>
                        </MDBBtn>

                    </div>

                    <div className="col-10 p-0" id="panel">
                        <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
                        <h3 className="px-4 textogris mt-5"><b>Tabla Clientes</b></h3>

                        <MDBTable id="tabla" className="shadow-3 rounded-5 mx-4 mt-4 text-center">
                            <MDBTableHead>
                                <tr>
                                    <th scope='col'>Nombre</th>
                                    <th scope='col'>DNI</th>
                                    <th scope='col'>Dirección</th>
                                    <th scope='col'>Teléfono</th>
                                    <th scope='col'>Teléfono2</th>
                                    <th scope='col'>Teléfono3</th>
                                    <th scope='col'>Debiente</th>
                                    <th scope='col'>Maps</th>
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
                                            <MDBBadge color={cliente.prestamoActual.montoAdeudado > 0 ? 'danger' : 'success'} pill>
                                                {cliente.prestamoActual.montoAdeudado}
                                            </MDBBadge>
                                        </td>
                                        <td>
                                            <MDBBtn color="success" href={cliente.googleMaps} target="_blank">
                                                <MDBIcon fas icon="map-marker-alt" size="md" color="light" />
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                </div>
            </MDBCard>
        </MDBContainer>
    );
}
