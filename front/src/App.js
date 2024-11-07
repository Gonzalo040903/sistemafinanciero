// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './paginas/loginPage';
import { PanelPage } from './paginas/panelPage';
import { AgregarclientePage } from './paginas/agregarclientePage';
import { EliminarclientePage } from './paginas/eliminarclientePage';
import { ModificarclientePage } from './paginas/modificarclientePage';
import { NuevocobroPage } from './paginas/nuevocobroPage';
import { VendedoresPage } from './paginas/vendedoresPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/panel" element={<PanelPage />} />
            <Route path="/agregar-cliente" element={<AgregarclientePage />} />
            <Route path="/eliminar-cliente" element={<EliminarclientePage />} />
            <Route path="/modificar-cliente" element={<ModificarclientePage />} />
            <Route path="/nuevo-cobro" element={<NuevocobroPage />} />
            <Route path='/vendedores' element={<VendedoresPage />} />
        </Routes>
    );
}

export default App;
