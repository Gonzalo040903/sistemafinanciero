import {
    MDBBtn,
} from 'mdb-react-ui-kit';

export function PaginaError() {
    return (
        <div className=" pt-5 text-center">
            <h1 className="text-center mt-5 text-danger">ERROR 404</h1>
            <h3 className="text-center mt-0 text-muted">PAGINA NO ENCONTRADA</h3>
            <MDBBtn className='mt-3' color='info' href="/">VOLVER AL INICIO</MDBBtn>
        </div>
    )
}