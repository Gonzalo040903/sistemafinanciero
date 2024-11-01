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
import toast, { Toaster } from 'react-hot-toast';

export function Agregarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);

    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };
    // funcion calcular
    const calcular = (e) => {
        e.preventDefault();
        let monto = parseInt(document.getElementById("formMonto").value);
        let intereses = parseInt(document.getElementById("formIntereses").value);
        let montoFinal = (monto * intereses / 100) + monto
        let semana = parseInt(document.getElementById("formSemanas").value);
        let montoxsemana = montoFinal / semana;
        let semanapaga = document.getElementById("formSemanaPaga")
        let devuelve = document.getElementById("formDevuelve")
        if (monto){
            semanapaga.value = montoxsemana;
            devuelve.value = montoFinal;
        }
    }
    const CustomInput = ({ label, type, id }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} />
    );

    let palabra = "Panel de control > Registro Clientes > Agregar Cliente";
    const funcionSuccess = (e) => {
        e.preventDefault();
        toast.success('Nuevo Cliente Creado');
    };
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
                                <h3 className="text-center text-muted mb-3">Prestamo</h3>
                                <MDBRow>
                                    <MDBCol col='3'>
                                        <CustomInput label='Monto' id='formMonto' type='number' />
                                    </MDBCol>

                                    <MDBCol col='3'>
                                        <CustomInput label='%Intereses' id='formIntereses' type='number' />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol col='3'>
                                        <CustomInput label='Fecha Inicio' id='formFecha' type='date' />
                                    </MDBCol>

                                    {/* Select de Semanas */}
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
                                <MDBBtn className='w-100' href='/error' size='md' style={{ backgroundColor: '#15b1e5' }} onClick={funcionSuccess}>Registrar Nuevo Cliente</MDBBtn>
                            </div>
                        </div>
                    </div>
                </div>
            </MDBCard>
        </MDBContainer>
    );
}
