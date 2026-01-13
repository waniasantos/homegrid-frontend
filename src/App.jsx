import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Relatorios from "./pages/Relatorios.jsx";
import Alertas from "./pages/Alertas.jsx";
import Anomalias from "./pages/Anomalias.jsx";
import Configuracoes from "./pages/Configuracoes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/anomalias" element={<Anomalias />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
