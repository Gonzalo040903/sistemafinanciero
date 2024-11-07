import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import toast, { Toaster } from 'react-hot-toast';
import { LoginPage } from "./paginas/loginPage.jsx"
import { PanelPage } from './paginas/panelPage.jsx';
import { AgregarclientePage } from "./paginas/agregarclientePage.jsx";
import { EliminarclientePage } from './paginas/eliminarclientePage.jsx';
import { ModificarclientePage } from './paginas/modificarclientePage.jsx';
import { NuevocobroPage } from './paginas/nuevocobroPage.jsx';
import { Nuevocobro } from './componentes/nuevo cobro/nuevocobro.jsx';
import { Vendedores } from './componentes/vendedores/vendedores.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='mt-5'>
      <Vendedores />
    </div>
  </React.StrictMode>
);

reportWebVitals();
