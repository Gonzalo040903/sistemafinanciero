import "./modificarclienteStyle.css";
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
    MDBInput,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

export function Modificarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };

    const funcionSuccess = (e) => {
        e.preventDefault();
        toast.success('Cliente Modificado');
        toggleOpen();
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
        <MDBInput
            wrapperClass='mb-4'
            label={label}
            id={id}
            type={type}
            {...field} // Pasa automáticamente los props de `Field` (value, onChange, onBlur)
        />
    );

    const submitCliente = async (values, { resetForm }) => {
        try {
            const response = await fetch(`http://localhost:3001/api/clientes/${clienteSeleccionado.dni}`, {
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
            } else {
                toast.error("Error al modificar el cliente");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            toast.error("Error en la solicitud");
        }
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

    const handleEditarCliente = (cliente) => {
        setClienteSeleccionado(cliente);
        toggleOpen();
    };

    const palabra = "Panel de control > Registro Clientes > Modificar Cliente";

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
                        <h3 className="px-4 textogris mt-5 mx-1"><b>Modificar Clientes</b></h3>

                        {/* TABLA */}
                        <MDBTable id="tabla" className="shadow-3 rounded-5 mx-4 mt-4 text-center">
                            <MDBTableHead>
                                <tr>
                                    <th scope='col'>Nombre</th>
                                    <th scope='col'>DNI</th>
                                    <th scope='col'>Direccion</th>
                                    <th scope='col'>Telefono</th>
                                    <th scope='col'>Telefono 2</th>
                                    <th scope='col'>Telefono 3</th>
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
            </MDBCard>

            {/* MODAL */}
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                <MDBModalDialog size="md">
                    <MDBModalContent>

                        {/* FORMULARIO */}
                        <div className="modal-header">
                            <MDBModalTitle>Modificar Cliente</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={() => setBasicModal(false)} />
                        </div>

                        <MDBModalBody>
                            {clienteSeleccionado && (
                                <Formik
                                    initialValues={{
                                        formNombre: clienteSeleccionado.nombre,
                                        formApellido: clienteSeleccionado.apellido,
                                        formDni: clienteSeleccionado.dni,
                                        formTel: clienteSeleccionado.telefonoPersonal,
                                        formTel2: clienteSeleccionado.telefonoReferencia,
                                        formTel3: clienteSeleccionado.telefonoTres,
                                        formDirec: clienteSeleccionado.direccion,
                                        formMaps: clienteSeleccionado.googleMaps
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={submitCliente}
                                >
                                    {({ isSubmitting, resetForm }) => (
                                        <Form className="row">
                                            <MDBRow>
                                                <MDBCol col='6'>
                                                    <Field name="formNombre" type="text" component={CustomInput} label="Nombres" />
                                                </MDBCol>
                                                <MDBCol col='6'>
                                                    <Field name="formApellido" type="text" component={CustomInput} label="Apellidos" />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol col='6'>
                                                    <Field name="formDni" type="text" component={CustomInput} label="DNI" />
                                                </MDBCol>
                                                <MDBCol col='6'>
                                                    <Field name="formTel" type="text" component={CustomInput} label="Telefono" />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol col='6'>
                                                    <Field name="formTel2" type="text" component={CustomInput} label="Telefono 2" />
                                                </MDBCol>
                                                <MDBCol col='6'>
                                                    <Field name="formTel3" type="text" component={CustomInput} label="Telefono 3" />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol col='12'>
                                                    <Field name="formDirec" type="text" component={CustomInput} label="Dirección" />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol col='12'>
                                                    <Field name="formMaps" type="text" component={CustomInput} label="Google Maps" />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBModalFooter>
                                                <MDBBtn type="submit" color="success" disabled={isSubmitting}>
                                                    Modificar Cliente
                                                </MDBBtn>
                                                <MDBBtn color="secondary" onClick={() => setBasicModal(false)}>
                                                    Cerrar
                                                </MDBBtn>
                                            </MDBModalFooter>
                                        </Form>
                                    )}
                                </Formik>
                            )}
                        </MDBModalBody>

                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer>
    );
}
