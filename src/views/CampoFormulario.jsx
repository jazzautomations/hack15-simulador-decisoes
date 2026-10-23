import React from "react";
import { PERDA_POR_FAIXA } from "../lib/credito.js";

const CAMPOS = [
  ["contrato", "Contrato médio (R$)", "0.01"], ["receita", "Receita/contrato/mês: juros + tarifa (R$)", "0.01"],
  ["contratos", "Contratos ativos no mês", "1"], ["funding", "Funding/contrato/mês (R$)", "0.01"],
  ["cobranca", "Cobrança/contrato/mês (R$)", "0.01"], ["fixo", "Fixos: time + tecnologia + compliance (R$)", "0.01"]
];

export function CampoFormulario({ formData, onChange }) {
  return (
    <>
      <div className="mb-2">
        <label>Produto de crédito</label>
        <input name="nome" value={formData.nome} onChange={onChange} required />
      </div>
      <div className="grid-2">
        {CAMPOS.map(([name, label, step]) => (
          <div className="mb-2" key={name}>
            <label>{label}</label>
            <input type="number" step={step} min="0" name={name} value={formData[name]} onChange={onChange} required />
          </div>
        ))}
      </div>
      <label>Mix da carteira por score (% · perda esperada tabelada)</label>
      <div className="grid-2">
        {Object.entries(PERDA_POR_FAIXA).map(([f, perda]) => (
          <div className="mb-2" key={f}>
            <label>Faixa {f} (perda R$ {perda})</label>
            <input type="number" step="1" min="0" max="100" name={`mix.${f}`} value={formData.mix[f]} onChange={onChange} required />
          </div>
        ))}
      </div>
    </>
  );
}
