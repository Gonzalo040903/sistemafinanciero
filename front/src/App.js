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
import { RutaPrivada } from './componentes/autenticacion/rutaPrivada'; // Asegúrate de que esta ruta sea correcta
import { PaginaError } from './paginas/paginaerror';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/panel" element={<RutaPrivada><PanelPage /></RutaPrivada>} />
            <Route path="/agregar-cliente" element={<RutaPrivada><AgregarclientePage /></RutaPrivada>} />
            <Route path="/eliminar-cliente" element={<RutaPrivada><EliminarclientePage /></RutaPrivada>} />
            <Route path="/modificar-cliente" element={<RutaPrivada><ModificarclientePage /></RutaPrivada>} />
            <Route path="/nuevo-cobro" element={<RutaPrivada><NuevocobroPage /></RutaPrivada>} />
            <Route path="/vendedores" element={<RutaPrivada><VendedoresPage /></RutaPrivada>} />
            <Route path="/*" element={<PaginaError />} />
        </Routes>
    );
}

export default App;
