import React from "react";

export function AjustesCenario({ ajustes, onChange }) {
  return (
    <div className="grid-2 mt-3">
      <div className="mb-2">
        <label>Preço do desconto (R$)</label>
        <input type="number" step="0.01" min="0" value={ajustes.precoDesconto}
          onChange={(e) => onChange((a) => ({ ...a, precoDesconto: Number(e.target.value) }))} />
      </div>
      <div className="mb-2">
        <label>Custo variável alto (R$)</label>
        <input type="number" step="0.01" min="0" value={ajustes.custoAlto}
          onChange={(e) => onChange((a) => ({ ...a, custoAlto: Number(e.target.value) }))} />
      </div>
    </div>
  );
}
