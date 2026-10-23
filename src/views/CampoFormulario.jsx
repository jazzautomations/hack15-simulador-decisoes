import React from "react";

export function CampoFormulario({ formData, onChange }) {
  return (
    <>
      <div className="mb-2">
        <label>Nome do produto</label>
        <input name="nome" value={formData.nome} onChange={onChange} required />
      </div>
      <div className="grid-2">
        <div className="mb-2">
          <label>Preço unitário (R$)</label>
          <input type="number" step="0.01" min="0.01" name="preco" value={formData.preco} onChange={onChange} required />
        </div>
        <div className="mb-2">
          <label>Quantidade vendida</label>
          <input type="number" min="0" name="quantidade" value={formData.quantidade} onChange={onChange} required />
        </div>
      </div>
      <div className="grid-2">
        <div className="mb-2">
          <label>Custo fixo total (R$)</label>
          <input type="number" step="0.01" min="0" name="fixo" value={formData.fixo} onChange={onChange} required />
        </div>
        <div className="mb-2">
          <label>Custo variável/unitário (R$)</label>
          <input type="number" step="0.01" min="0" name="variavel" value={formData.variavel} onChange={onChange} required />
        </div>
      </div>
    </>
  );
}
