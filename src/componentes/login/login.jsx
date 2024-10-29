import React from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
} from 'mdb-react-ui-kit';
import './styleLogin.css'; // Importa el archivo CSS

const CustomInput = ({ label, type, id }) => (
    <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} />
);

export function Login() {
    return (
        <MDBContainer fluid className='p-4'>

            <MDBRow className='contenedorLogin'>

                <MDBCol md='5' className='text-center text-md-start d-flex flex-column justify-content-center me-4'>

                    <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                        Inicia Sesión <br></br> Con tu cuenta de <br />
                        <span className="text-custom-color" >Admin</span>
                    </h1>

                    <p className='px-3 text-muted'>
                        Sistema Financiero, Gestión de Cuentas:<br></br>

                        Creación y administración de cuentas bancarias y contables.<br></br>
                        Registro y seguimiento de saldos y movimientos en tiempo real.

                    </p>
                </MDBCol>


                <MDBCol md='5' className='mt-5'>

                    <MDBCard className='my-5'>
                        <MDBCardBody className='p-5'>

                            <CustomInput label='Email' id='formEmail' type='email' />
                            <CustomInput label='Contraseña' id='formPassword' type='password' />

                            <MDBBtn className='w-100 mb-4' href='/error' size='md' style={{ backgroundColor: '#15b1e5' }} >Iniciar sesion</MDBBtn>

                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>

            </MDBRow>

        </MDBContainer>
    );
}

