import "./modificarclienteStyle.css";
import {
    MDBContainer,
    MDBCard,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBIcon,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export function Modificarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };


    const validationSchema = Yup.object({
        formNombre: Yup.string().min(2, 'Mínimo 2 caracteres').max(20, 'Máximo 20 caracteres').required('Campo obligatorio'),
        formApellido: Yup.string().min(2, 'Mínimo 2 caracteres').max(20, 'Máximo 20 caracteres').required('Campo obligatorio'),
        formDni: Yup.string().matches(/^\d+$/, 'Solo números').length(8, 'Debe tener 8 caracteres').required('Campo obligatorio'),
        formTel: Yup.string().matches(/^\d+$/, 'Solo números').max(11, 'Máximo 11 caracteres').required('Campo obligatorio'),
        formTel2: Yup.string().matches(/^\d+$/, 'Solo números').max(11, 'Máximo 11 caracteres').required('Campo obligatorio'),
        formTel3: Yup.string().matches(/^\d+$/, 'Solo números').max(11, 'Máximo 11 caracteres').required('Campo obligatorio'),
        formDirec: Yup.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres').required('Campo obligatorio'),
        formMaps: Yup.string().min(2, 'Mínimo 2 caracteres').max(300, 'Máximo 300 caracteres').required('Campo obligatorio'),
    });

    const CustomInput = ({ label, type, id, field, form }) => (
        <div className="input-container">
            <MDBInput
                wrapperClass='mb-4'
                label={label}
                id={id}
                type={type}
                {...field}
            />
            <ErrorMessage name={id} component="div" className="error-message" />
        </div>
    );

    const fetchClientes = async () => {
        try {
            const response = await axios.get('https://sistemafinanciero.up.railway.app/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    const submitCliente = async (values, { resetForm }) => {
        try {
            const response = await fetch(`https://sistemafinanciero.up.railway.app/api/clientes/${clienteSeleccionado.dni}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: values.formNombre,
                    apellido: values.formApellido,
                    dni: values.formDni,
                    direccion: values.formDirec,
                    googleMaps: values.formMaps,
                    telefonoPersonal: values.formTel,
                    telefonoReferencia: values.formTel2,
                    telefonoTres: values.formTel3,
                })
            });

            if (response.ok) {
                toast.success("Cliente Modificado");
                resetForm();
                setClienteSeleccionado(null);
                toggleOpen();
                fetchClientes(); // Recargar los clientes después de la modificación
            } else {
                toast.error("Error al modificar el cliente");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            toast.error("Error en la solicitud");
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleEditarCliente = (cliente) => {
        setClienteSeleccionado(cliente);
        toggleOpen();
    };

    const palabra = "Panel de control > Registro Clientes > Modificar Cliente";

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
                            {localStorage.getItem('role') !== 'vendedor' && (
                                <MDBNavbarLink href="/vendedores" className="nav-item-link py-1">
                                    <MDBIcon fas icon="key" className="me-2 mx-0 mt-2" />
                                    Vendedores
                                </MDBNavbarLink>
                            )}

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
                                    {localStorage.getItem('role') !== 'vendedor' && (
                                        <MDBNavbarLink href="/vendedores" className="nav-item-link">
                                            <MDBIcon fas icon="key" className="me-2 mx-0 mt-2" />
                                            Vendedores
                                        </MDBNavbarLink>
                                    )}

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
                            <h3 className="px-4 textogris mt-5 mx-1"><b>Modificar Clientes</b></h3>

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
                                                    <MDBBtn color="warning" onClick={() => handleEditarCliente(cliente)}>
                                                        modificar
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

                {/* MODAL */}
                <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                    <MDBModalDialog size="md">
                        <MDBModalContent>

                            {/* FORMULARIO */}
                            <div className="modal-header">
                                <MDBModalTitle>Modificar Cliente</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                            </div>

                            <Formik
                                initialValues={{
                                    formNombre: clienteSeleccionado ? clienteSeleccionado.nombre : "",
                                    formApellido: clienteSeleccionado ? clienteSeleccionado.apellido : "",
                                    formDni: clienteSeleccionado ? clienteSeleccionado.dni : "",
                                    formTel: clienteSeleccionado ? clienteSeleccionado.telefonoPersonal : "",
                                    formTel2: clienteSeleccionado ? clienteSeleccionado.telefonoReferencia : "",
                                    formTel3: clienteSeleccionado ? clienteSeleccionado.telefonoTres : "",
                                    formDirec: clienteSeleccionado ? clienteSeleccionado.direccion : "",
                                    formMaps: clienteSeleccionado ? clienteSeleccionado.googleMaps : "",
                                }}
                                validationSchema={validationSchema}
                                onSubmit={submitCliente}
                                enableReinitialize={true}
                            >
                                <Form>
                                    <MDBModalBody className="py-1 pt-3">
                                        <MDBRow>
                                            <MDBCol md="6">
                                                <Field name="formNombre" label="Nombre" id="formNombre" component={CustomInput} type="text" />
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <Field name="formApellido" label="Apellido" id="formApellido" component={CustomInput} type="text" />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol md="6">
                                                <Field name="formDni" label="DNI" id="formDni" component={CustomInput} type="text" />
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <Field name="formTel" label="Teléfono" id="formTel" component={CustomInput} type="text" />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol md="6">
                                                <Field name="formTel2" label="Teléfono 2" id="formTel2" component={CustomInput} type="text" />
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <Field name="formTel3" label="Teléfono 3" id="formTel3" component={CustomInput} type="text" />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol md="12">
                                                <Field name="formDirec" label="Dirección" id="formDirec" component={CustomInput} type="text" />
                                            </MDBCol>
                                            <MDBCol md="12">
                                                <Field name="formMaps" label="Google Maps" id="formMaps" component={CustomInput} type="text" />
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color='success' type="submit" className="w-100">
                                            Guardar Cambios
                                        </MDBBtn>
                                    </MDBModalFooter>
                                </Form>
                            </Formik>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </MDBContainer>
        </>
    );
}
