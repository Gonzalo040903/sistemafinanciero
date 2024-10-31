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
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export function Modificarcliente() {
    const [isGestionClientesOpen, setIsGestionClientesOpen] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleGestionClientes = () => {
        setIsGestionClientesOpen(!isGestionClientesOpen);
    };
    const [semanas, setSemanas] = useState('1');
    const [monto, setMonto] = useState('');
    const [intereses, setIntereses] = useState('');
    const calcularDevuelve = () => {
        if (monto && intereses) {
            const montoFloat = parseFloat(monto);
            const interesFloat = (montoFloat * parseFloat(intereses)) / 100;
            return (montoFloat + interesFloat).toFixed(2);
        }
        return '';
    };
    const funcionSuccess = (e) => {
        e.preventDefault();
        toast.success('Nuevo Cliente Creado')
    }
    // Calcula el pago semanal
    const calcularPagoSemanal = () => {
        if (monto && semanas) {
            return (parseFloat(monto) / parseInt(semanas)).toFixed(2);
        }
        return '';
    };

    const CustomInput = ({ label, type, id, value, onChange }) => (
        <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} value={value} onChange={onChange} />
    );
    let palabra = "Panel de control > Registro Clientes > Modificar Cliente";

    return (
        <MDBContainer fluid className='col-10' id="container">
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
                                        <MDBBtn color='warning' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Modificar
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
                                        <MDBBtn color='warning' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Modificar
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
                                        <MDBBtn color='warning' size='sm' onClick={toggleOpen}>
                                            <MDBIcon icon="pencil-alt" className="me-2" />
                                            Modificar
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
                <MDBModalDialog size="xl">





                    <div className="p-5 mx-4 mt-0 px-4 rounded-5 shadow-3 mb-4 row" id="formulario">
                        <h3>Modificar Cliente</h3>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
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
                                    <CustomInput label='Monto' id='formMonto' type='number' value={monto} onChange={(e) => setMonto(e.target.value)} />
                                </MDBCol>
                                <MDBCol col='3'>
                                    <CustomInput label='%Intereses' id='formIntereses' type='number' value={intereses} onChange={(e) => setIntereses(e.target.value)} />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol col='3'>
                                    <CustomInput label='Fecha Inicio' id='formFecha' type='date' />
                                </MDBCol>
                                <MDBCol col='3'>
                                    <select className="form-select" value={semanas} onChange={(e) => setSemanas(e.target.value)}>
                                        <option value="1">Semana 1</option>
                                        <option value="2">Semana 2</option>
                                        <option value="3">Semana 3</option>
                                        <option value="4">Semana 4</option>
                                        <option value="5">Semana 5</option>
                                        <option value="6">Semana 6</option>
                                        <option value="7">Semana 7</option>
                                        <option value="8">Semana 8</option>
                                        <option value="9">Semana 9</option>
                                        <option value="10">Semana 10</option>
                                        <option value="11">Semana 11</option>
                                        <option value="12">Semana 12</option>
                                    </select>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className="mt-2">
                                <MDBCol col='3'>
                                    <label htmlFor="" className="text-muted">Devuelve</label>
                                    <MDBInput label="" id="formDevuelve" type="text" value={calcularDevuelve()} disabled />
                                </MDBCol>
                                <MDBCol col='3'>
                                    <label htmlFor="" className="text-muted">Cada semana paga</label>
                                    <MDBInput label="" id="formControlDisabled" type="text" value={calcularPagoSemanal()} disabled />
                                </MDBCol>
                            </MDBRow>
                        </div>
                    
                        <MDBBtn color="success">Guardar Cambios</MDBBtn>
                    </div>
                </MDBModalDialog>
            </MDBModal>
        </MDBContainer >
    );
}
