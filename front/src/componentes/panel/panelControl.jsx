        import "./panelControl.css";
        import {
            MDBContainer,
            MDBCard,
            MDBNavbarLink,
            MDBNavbarNav,
            MDBIcon,
            MDBBadge,
            MDBTable,
            MDBTableHead,
            MDBTableBody,
            MDBBtn, MDBModal,
            MDBModalContent,
            MDBModalDialog,
            MDBModalHeader
        } from 'mdb-react-ui-kit';
        import { useState, useEffect } from 'react';
        import { useNavigate } from 'react-router-dom';
        import axios from 'axios';


        export function PanelControl() {
            const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
            const [clientes, setClientes] = useState([]);
            const navigate = useNavigate();
            const [basicModal, setBasicModal] = useState(false);
            const [isMobile, setIsMobile] = useState(false);


            const toggleOpen = () => setBasicModal(!basicModal);
            const toggleGestionClientes = () => {
                setIsGestionClientesOpen(!isGestionClientesOpen);
            };

            const handleLogout = () => {
                localStorage.removeItem('token');
                navigate('/'); // Redirige al usuario al login
            };
            const apiUrl = process.env.REACT_APP_API_URL;
            const [reporte, setReporte] = useState(null);

            const fetchBalance = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/api/reporte/balance-semanal');
                    console.log("DATA del Balance",response.data);
                    setReporte(response.data);
                    if (response.data) {
                        toggleOpen();
                    }
                } catch (error) {
                    console.error("Error al obtener balance:", error);
                }
            };

            useEffect(() => {
                // Llamada a la API para obtener clientes
                const fetchClientes = async () => {
                    try {
                        const response = await axios.get(`http://localhost:3001/api/clientes`);
                        setClientes(response.data);
                    } catch (error) {
                        console.error("Error al obtener los clientes:", error);
                    }
                };

                fetchClientes();
            }, []);

            let palabra = "Panel de control > Tabla Clientes";
            //const [isMobile, setIsMobile] = useState(false); NO SABEMOS SI VA 

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

                                <div className="col-lg-10 col-md-12 p-0" id="panel">
                                    <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
                                    <h3 className="px-4 textogris mt-5 mx-1"><b>Tabla Clientes <MDBBtn size="sm" color="info" onClick={toggleOpen}> <MDBIcon icon="balance-scale" className="" size="md" color="white" /></MDBBtn></b></h3>
                                    <div className="mx-4 mt-4 scrollable-content2">
                                        <MDBTable id="tabla" className="shadow-3 mx-2 rounded-5 text-center">
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
                                                {[...clientes]
                                                    .sort((a, b) => {
                                                        const deudaA = a.prestamoActual.montoFinal - a.prestamoActual.montoAdeudado;
                                                        const deudaB = b.prestamoActual.montoFinal - b.prestamoActual.montoAdeudado;
                                                        return deudaB - deudaA; // De mayor a menor
                                                    })
                                                    .map((cliente) => (
                                                        <tr key={cliente.dni}>
                                                            <td>{cliente.nombre} {cliente.apellido}</td>
                                                            <td>{cliente.dni}</td>
                                                            <td>{cliente.direccion}</td>
                                                            <td>{cliente.telefonoPersonal}</td>
                                                            <td>{cliente.telefonoReferencia}</td>
                                                            <td>{cliente.telefonoTres}</td>
                                                            <td>
                                                                <MDBBadge
                                                                    color={(cliente.prestamoActual.montoFinal - cliente.prestamoActual.montoAdeudado) > 0 ? 'danger' : 'success'}
                                                                    pill
                                                                >
                                                                    {'$ ' + (cliente.prestamoActual.montoFinal - cliente.prestamoActual.montoAdeudado).toLocaleString('es-AR')}
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

                                {/* MODAL  */}
                                <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                                    <MDBModalDialog size="xl">
                                        <MDBModalContent>
                                            <div className="rounded-5 shadow-3 p-4 row" id="formulario">
                                                <MDBModalHeader className="mb-4">
                                                    <h2 className=""><b>Reporte Semanal</b></h2>
                                                    <MDBBtn className='btn-close' color='info' onClick={fetchBalance}></MDBBtn>
                                                </MDBModalHeader>
                                                <div className="col-10 my-3">
                                                    {/* AQUI EL CONTENTIDO DEL BALANCE  */}
                                                    {reporte ? (
                                                        <>
                                                            <h4>Nuevos Clientes: {reporte.nuevosClientes}</h4>
                                                            <p>Total Prestado: ${reporte.totalPrestado.toLocaleString('es-AR')}</p>
                                                            <p>Total Cobrado: ${reporte.totalCobrado.toLocaleString('es-AR')}</p>

                                                            <h5 className="mt-4">Préstamos Realizados en la Semana</h5>
                                                            <MDBTable small striped bordered>
                                                                <MDBTableHead>
                                                                    <tr>
                                                                        <th>Cliente</th>
                                                                        <th>Monto</th>
                                                                        <th>Fecha</th>
                                                                    </tr>
                                                                </MDBTableHead>
                                                                <MDBTableBody>
                                                                    {reporte.prestamosDeLaSemana.map((prestamo, index) => (
                                                                        <tr key={index}>
                                                                            <td>{prestamo.cliente}</td>
                                                                            <td>${prestamo.monto.toLocaleString('es-AR')}</td>
                                                                            <td>{prestamo.fechaFormateada}</td>
                                                                        </tr>
                                                                    ))}
                                                                </MDBTableBody>
                                                            </MDBTable>
                                                        </>
                                                        ) : (
                                                            <p>cargando reporte...</p>
                                                        )}
                                                </div>
                                            </div>

                                        </MDBModalContent>
                                    </MDBModalDialog>
                                </MDBModal>
                            </div>
                        </MDBCard>
                    </MDBContainer>
                </>
            );
        }
