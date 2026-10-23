import React from "react";
import { validarProduto } from "../lib/schema.js";
import { CampoFormulario } from "./CampoFormulario.jsx";
import { ErrosValidacao } from "./ErrosValidacao.jsx";

export function FormularioBase({ onSubmit }) {
  const [formData, setFormData] = React.useState({
    nome: "Produto Exemplo",
    preco: 50,
    quantidade: 100,
    fixo: 2000,
    variavel: 20
  });
  const [erros, setErros] = React.useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: name === "nome" ? value : Number(value) || value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacao = validarProduto(formData);
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
