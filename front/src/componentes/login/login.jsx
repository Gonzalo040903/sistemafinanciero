import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
} from 'mdb-react-ui-kit';
import './styleLogin.css';
import toast, { Toaster } from 'react-hot-toast';

const CustomInput = ({ label, type, id, value, onChange }) => (
    <MDBInput wrapperClass='mb-4' label={label} id={id} type={type} value={value} onChange={onChange} />
);

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
            toast.success('Inicio de sesión exitoso');
            // Redireccionar o realizar alguna acción adicional
        } else {
            toast.error('Credenciales incorrectas');
        }
    };

    return (
        <MDBContainer fluid className='p-4'>
            <Toaster position="top-center" reverseOrder={false} />
            
            <MDBRow className='contenedorLogin'>
                <MDBCol md='5' className='text-center text-md-start d-flex flex-column justify-content-center me-4'>
                    <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                        Inicia Sesión <br /> Con tu cuenta de <br />
                        <span className="text-custom-color">Admin</span>
                    </h1>

                    <p className='px-3 text-muted'>
                        Sistema Financiero, Gestión de Cuentas:<br />
                        Creación y administración de cuentas bancarias y contables.<br />
                        Registro y seguimiento de saldos y movimientos en tiempo real.
                    </p>
                </MDBCol>

                <MDBCol md='5' className='mt-5'>
                    <MDBCard className='my-5'>
                        <MDBCardBody className='p-5'>
                            <CustomInput
                                label='Email'
                                id='formEmail'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <CustomInput
                                label='Contraseña'
                                id='formPassword'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <MDBBtn
                                className='w-100 mb-4'
                                size='md'
                                style={{ backgroundColor: '#15b1e5' }}
                                onClick={handleLogin}
                            >
                                Iniciar sesión
                            </MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}
