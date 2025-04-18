import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import './styleLogin.css';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // <-- Importamos los íconos

const CustomInput = ({ label, type, id, value, onChange, isPassword }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ position: 'relative' }}>
            <MDBInput
                wrapperClass='mb-4'
                label={label}
                id={id}
                type={isPassword ? (showPassword ? 'text' : 'password') : type}
                value={value}
                onChange={onChange}
            />
            {isPassword && (
                <span
                    onClick={togglePasswordVisibility}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '15px',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: '2',
                        color: '#6c757d'
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            )}
        </div>
    );
};

export function Login() {
    const [nombre, setNombre] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();

    const handleLogin = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        navigate('/panel');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('https://sistemafinanciero.up.railway.app/api/login', { nombre, contraseña });
            const { token, role, vendedor } = res.data;

            handleLogin(token,role);

            if (role === 'admin') {
                toast.success('Inicio de sesión como administrador');
                navigate('/panel');
            } else if (role === 'vendedor') {
                toast.success('Inicio de sesión como vendedor');
                navigate('/panel', { state: { vendedor } });
            } else {
                toast.error('Rol no autorizado');
            }
        } catch (err) {
            console.error('Error de inicio de sesión:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Error en las credenciales. Verifique su nombre y contraseña.');
        }
    };

    return (
        <MDBContainer fluid className='p-4 pt-5 mt-4'>
            <Toaster position="top-center" reverseOrder={false} />
            <MDBRow className='contenedorLogin'>
                <MDBCol md='5' className='text-center text-md-start d-flex flex-column justify-content-center me-4'>
                    <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                        Inicia Sesión <br /> a la  <br />
                        <span className="text-custom-color"><b>Financiera</b></span>
                    </h1>
                    <p className='px-3 text-muted'>
                        Sistema Financiero, Gestión de Cuentas:<br />
                        Creación y administración de cuentas y préstamos.
                    </p>
                </MDBCol>

                <MDBCol md='5' className='offset-md-1'>
                    <MDBCard className='my-5'>
                        <MDBCardBody className='p-5'>
                            <h2 className="text-center mb-4">Inicio de Sesión</h2>
                            <form onSubmit={handleSubmit}>
                                <CustomInput
                                    label="Nombre"
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                <CustomInput
                                    label="Contraseña"
                                    type="password"
                                    id="contraseña"
                                    value={contraseña}
                                    onChange={(e) => setContraseña(e.target.value)}
                                    isPassword={true}
                                />
                                <MDBBtn type="submit" className="mb-4 w-100" color='info'>Iniciar Sesión</MDBBtn>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}
