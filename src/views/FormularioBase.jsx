import React from "react";
import { validarCarteira } from "../lib/schema.js";
import { CampoFormulario } from "./CampoFormulario.jsx";
import { ErrosValidacao } from "./ErrosValidacao.jsx";

// Dados fictícios do enunciado: resultado atual de R$ 90.000
export function FormularioBase({ onSubmit }) {
  const [formData, setFormData] = React.useState({
    nome: "Empréstimo pessoal", contrato: 5000, receita: 200, contratos: 3000,
    funding: 60, cobranca: 10, fixo: 150000, mix: { A: 40, B: 40, C: 20 }
  });
  const [erros, setErros] = React.useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const v = name === "nome" || value === "" ? value : Number(value);
    setFormData((f) => name.startsWith("mix.")
      ? { ...f, mix: { ...f.mix, [name.slice(4)]: v } }
      : { ...f, [name]: v });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacao = validarCarteira(formData);
    if (!validacao.ok) {
      setErros(validacao.erros);
      return;
    }
    setErros([]);
    onSubmit(formData);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <CampoFormulario formData={formData} onChange={handleChange} />
      <ErrosValidacao erros={erros} />
      <button type="submit" className="primary mt-3">Simular</button>
    </form>
  );
}
