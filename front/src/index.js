import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { LoginPage } from "./paginas/loginPage.jsx"
import { PanelPage } from './paginas/panelPage.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='mt-5'>
      <PanelPage />
    </div>
  </React.StrictMode>
);

reportWebVitals();
