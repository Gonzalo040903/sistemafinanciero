import "./agregarcliente.css";
import {
    MDBContainer,
    MDBCard,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBIcon,
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBInput
} from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export function Agregarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);

    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };

    const calcular = (e) => {
        e.preventDefault();
        let monto = parseInt(document.getElementById("formMonto").value);
        let intereses = parseInt(document.getElementById("formIntereses").value);
        let soloInteres = document.querySelector("input[name='soloInteres']").checked;
        let montoFinal;
        if(soloInteres){
            montoFinal = monto * intereses / 100;
        } else {
            montoFinal = (monto * intereses / 100) + monto;
        }
    
        let semana = parseInt(document.getElementById("formSemanas").value);
        let montoxsemana = montoFinal / semana;
        let semanapaga = document.getElementById("formSemanaPaga");
        let devuelve = document.getElementById("formDevuelve");
        if (monto && intereses) {
            semanapaga.value = montoxsemana.toFixed(2);
            devuelve.value = montoFinal.toFixed(2);
        }
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
        formVendedor: Yup.string().min(2, 'Mínimo 2 caracteres').max(20, 'Campo obligatorio').required('Campo obligatorio'),
        formMonto: Yup.number().required('Campo obligatorio'),
        formIntereses: Yup.number().max(99, 'Máximo 2 caracteres').required('Campo obligatorio'),
        formFecha: Yup.date().required('Campo obligatorio'),
        soloInteres: Yup.boolean(),
    });

    const submitCliente = async (values, { resetForm }) => {
        try {
            // Formateamos la fecha para obtener una precisión más detallada
            const formattedDate = new Date(values.formFecha).toISOString();
    
            const response = await fetch("https://sistemafinanciero.up.railway.app/api/clientes", {
                method: "POST",
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
                    prestamoActual: {
                        monto: values.formMonto,
                        semanas: parseInt(document.getElementById("formSemanas").value),
                        intereses: values.formIntereses,
                        soloInteres: values.soloInteres,
                        fechaInicio: formattedDate,  // Aquí usamos la fecha formateada
                        vendedor: values.formVendedor
                    }
                })
            });
    
            if (response.ok) {
                toast.success("Nuevo Cliente Creado");
                resetForm();
                document.getElementById("formSemanas").value = 1;
            } else {
                toast.error("Error al crear el cliente");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            toast.error("Error en la solicitud");
        }
    };

    const CustomInput = ({ label, type, id, formik }) => (
        <div className="input-container">
            <MDBInput wrapperClass="mb-0" label={label} id={id} type={type} {...formik.getFieldProps(id)} />
            <ErrorMessage name={id} component="div" className="error-message" />
        </div>
    );

    let palabra = "Panel de control > Registro Clientes > Agregar Cliente";
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

                        <div className="col-md-12 col-lg-10 p-0" id="panel">
                            <header className="p-2 mx-4 mt-3 px-4 header rounded-5 shadow-3">{palabra}</header>
                            <h3 className="px-4 textogris mt-5 mx-1"><b>Agregar Cliente</b></h3>

                            <Formik
                                initialValues={{
                                    formNombre: '',
                                    formApellido: '',
                                    formDni: '',
                                    formTel: '',
                                    formTel2: '',
                                    formTel3: '',
                                    formDirec: '',
                                    formMaps: '',
                                    formVendedor: '',
                                    formMonto: '',
                                    formIntereses: '',
                                    formFecha: '',
                                    soloInteres: false,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={submitCliente}
                            >
                                {formik => (
                                    <Form className="p-2 mx-4 mt-0 px-4 rounded-5 shadow-3 mb-4 row" id="formulario">
                                        <div className="col-md-12 col-lg-5">
                                            <h3 className="text-center text-muted mb-3">Cliente</h3>
                                            <MDBRow>
                                                <MDBCol col='3'>
                                                    <CustomInput label='Nombres' id='formNombre' formik={formik} />
                                                </MDBCol>
                                                <MDBCol col='3'>
                                                    <CustomInput label='Apellidos' id='formApellido' formik={formik} />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol>
                                                    <CustomInput label='DNI' id='formDni' formik={formik} />
                                                </MDBCol>
                                                <MDBCol>
                                                    <CustomInput label='Telefono' id='formTel' formik={formik} type="link" />
                                                </MDBCol>
                                            </MDBRow>


                                            <MDBRow>
                                                <MDBCol>
                                                    <CustomInput label='Telefono 2' id='formTel2' formik={formik} />
                                                </MDBCol>
                                                <MDBCol>
                                                    <CustomInput label='Telefono 3' id='formTel3' formik={formik} />
                                                </MDBCol>

                                            </MDBRow>
                                            <CustomInput label='Direccion' id='formDirec' formik={formik} />
                                            <CustomInput label='Maps' id='formMaps' formik={formik} type="url" />
                                            <MDBRow>
                                                <MDBCol>

                                                </MDBCol>
                                            </MDBRow>
                                        </div>
                                        <div className="col-md-12 col-lg-5">
                                            <h3 className="text-center text-muted mb-3">Prestamo</h3>
                                            <CustomInput label='Vendedor' id='formVendedor' formik={formik} />
                                            <MDBRow>
                                                <MDBCol col='3'>
                                                    <CustomInput label='Monto' id='formMonto' formik={formik} />
                                                </MDBCol>
                                                <MDBCol col='3'>
                                                    <CustomInput label='%Intereses' id='formIntereses' formik={formik} />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol col='3'>
                                                    <CustomInput label='Fecha Inicio' id='formFecha' formik={formik} type="date" />
                                                </MDBCol>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name="soloInteres"
                                                        checked={formik.values.soloInteres}
                                                        onChange={formik.handleChange}
                                                    />
                                                    Solo interes
                                                </label>
                                                <MDBCol col='3'>
                                                    <select id="formSemanas" className="form-select mb-4">
                                                        <option value={1}>1 Semana</option>
                                                        <option value={2}>2 Semanas</option>
                                                        <option value={3}>3 Semanas</option>
                                                        <option value={4}>4 Semanas</option>
                                                        <option value={5}>5 Semanas</option>
                                                        <option value={6}>6 Semanas</option>
                                                        <option value={7}>7 Semanas</option>
                                                        <option value={8}>8 Semanas</option>
                                                        <option value={9}>9 Semanas</option>
                                                        <option value={10}>10 Semanas</option>
                                                        <option value={11}>11 Semanas</option>
                                                        <option value={12}>12 Semanas</option>
                                                    </select>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className="">
                                                <MDBCol col='3'>
                                                    <MDBInput label="Monto Final" id="formDevuelve" value={" "} type="text" disabled />
                                                </MDBCol>
                                                <MDBCol col='3'>
                                                    <MDBInput label="Por Semana paga:" value={" "} id="formSemanaPaga" type="text" disabled />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol col='3'>
                                                    <MDBBtn className='w-100 mt-3' href='/error' size='md' color="dark" onClick={calcular}>Calcular intereses</MDBBtn>
                                                </MDBCol>
                                            </MDBRow>
                                        </div>
                                        <div className="col-6 mt-3">
                                            <MDBBtn className='w-100' href='' size='md' style={{ backgroundColor: '#15b1e5' }} type="submit">Registrar Nuevo Cliente</MDBBtn>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </MDBCard>
            </MDBContainer>
        </>
    );
}