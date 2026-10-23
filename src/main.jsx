import React from "react";
import { createRoot } from "react-dom/client";
import { FormularioBase } from "./views/FormularioBase.jsx";
import { Comparador } from "./views/Comparador.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const [base, setBase] = React.useState(null);
  return (
    <div className="container">
      <header>
        <h1>#15 Simulador de Decisões</h1>
        <small>Fintech de crédito · uma carteira · um mês · 3 cenários</small>
      </header>
      {!base ? (
        <FormularioBase onSubmit={setBase} />
      ) : (
        <Comparador base={base} onReset={() => setBase(null)} />
      )}
    </div>
  );
}
