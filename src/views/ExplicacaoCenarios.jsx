import React from "react";
import { explicar } from "../lib/explicacao.js";

export function ExplicacaoCenarios({ resultados }) {
  const [estado, setEstado] = React.useState({ carregando: false, texto: null });
  // Ajustes mudaram: a explicação anterior deixa de valer
  const chave = resultados.map((r) => `${r.lucro}|${r.quantidade}`).join(";");
  React.useEffect(() => { setEstado({ carregando: false, texto: null }); }, [chave]);

  const gerar = async () => {
    setEstado({ carregando: true, texto: null });
    setEstado({ carregando: false, texto: await explicar(resultados) });
  };

  return (
    <section className="card mt-3" aria-live="polite">
      <div className="explicacao-topo">
        <h2 style={{ fontSize: "1.1rem" }}>O que muda em cada cenário</h2>
        <button type="button" className="secondary" onClick={gerar} disabled={estado.carregando}>
          {estado.carregando ? "Gerando…" : "Explicar diferenças"}
        </button>
      </div>
      {estado.texto && (
        <>
          <ul className="explicacao mt-3">{estado.texto.frases.map((f, i) => <li key={i}>{f}</li>)}</ul>
          <small>Texto gerado por {estado.texto.origem} a partir dos números acima.</small>
        </>
      )}
    </section>
  );
}
