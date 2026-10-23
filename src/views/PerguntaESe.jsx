import React from "react";
import { interpretar, paraAjustes } from "../lib/eSe.js";

const ROTULOS = {
  descontoPP: (v) => `Desconto na taxa: ${String(v).replace(".", ",")} p.p.`,
  contratosDesconto: (v) => `Contratos com o desconto: ${v.toLocaleString("pt-BR")}`,
  choqueInad: (v) => `Aumento da inadimplência: ${String(v).replace(".", ",")}%`
};

export function PerguntaESe({ base, onAplicar }) {
  const [texto, setTexto] = React.useState("");
  const [estado, setEstado] = React.useState({ carregando: false, sugestao: null, erro: null });

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEstado({ carregando: true, sugestao: null, erro: null });
    const i = await interpretar(texto.trim());
    const novos = paraAjustes(i, base);
    if (i.fora_do_escopo || Object.keys(novos).length === 0) {
      setEstado({ carregando: false, sugestao: null, erro: i.resumo || "Não entendi a pergunta. Fale de desconto, contratos ou inadimplência." });
    } else {
      setEstado({ carregando: false, sugestao: { novos, origem: i.origem, resumo: i.resumo }, erro: null });
    }
  };

  const aplicar = () => { onAplicar(estado.sugestao.novos); setEstado({ carregando: false, sugestao: null, erro: null }); setTexto(""); };

  return (
    <form className="card mt-3" onSubmit={enviar}>
      <label htmlFor="e-se">E se…</label>
      <div className="e-se-linha">
        <input id="e-se" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={500}
          placeholder="ex.: e se eu der 0,5 p.p. de desconto e a carteira crescer 20%?" aria-describedby="e-se-msg" />
        <button type="submit" className="primary" disabled={estado.carregando}>{estado.carregando ? "Interpretando…" : "Simular"}</button>
      </div>
      <div id="e-se-msg" aria-live="polite">
        {estado.erro && <p className="metric-negative mt-3">{estado.erro}</p>}
        {estado.sugestao && (
          <div className="mt-3 e-se-sugestao">
            <small>Interpretado por {estado.sugestao.origem}. Confira antes de aplicar:</small>
            <ul>{Object.entries(estado.sugestao.novos).map(([k, v]) => <li key={k}>{ROTULOS[k](v)}</li>)}</ul>
            <div className="e-se-acoes">
              <button type="button" className="primary" onClick={aplicar}>Aplicar</button>
              <button type="button" className="secondary" onClick={() => setEstado({ carregando: false, sugestao: null, erro: null })}>Descartar</button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
