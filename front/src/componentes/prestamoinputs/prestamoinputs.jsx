export function PrestamoInputs() {
    const calcular = (e) => {
        e.preventDefault();
        let monto = parseInt(document.getElementById("formMonto").value);
        let intereses = parseInt(document.getElementById("formIntereses").value);
        let montoFinal = (monto * intereses / 100) + monto
        let semana = parseInt(document.getElementById("formSemanas").value);
        let montoxsemana = montoFinal / semana;
        let semanapaga = document.getElementById("formSemanaPaga")
        let devuelve = document.getElementById("formDevuelve")
        if (monto && intereses) {
            semanapaga.value = montoxsemana;
            devuelve.value = montoFinal;
        }
    }

    return (
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
    )
}

