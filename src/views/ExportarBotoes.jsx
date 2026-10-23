import React from "react";

export function ExportarBotoes({ onReset, base, ajustes, resultados }) {
  const exportarJSON = () => {
    const payload = { base, ajustes, resultados };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "simulacao-15.json";
    a.click(); URL.revokeObjectURL(url);
  };

  const exportarCSV = () => {
    const header = "cenario,receita_por_contrato,contratos,custo_variavel_por_contrato,custo_total,receita,resultado,margem_pct,variacao_pct";
    const rows = resultados.map((r) =>
      `${r.label},${r.preco},${base.contratos},${r.variavel},${r.custo_total},${r.receita},${r.lucro},${Math.round(r.margem)},${r.delta ?? ""}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "comparacao-15.csv";
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="grid-2 mt-3">
      <button className="secondary" onClick={onReset}>← Voltar</button>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="primary" onClick={exportarJSON}>Exportar JSON</button>
        <button className="primary" onClick={exportarCSV}>Exportar CSV</button>
      </div>
    </div>
  );
}
