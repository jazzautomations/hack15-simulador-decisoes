// #15 Rota /api/interpretar (só no servidor do Vite): a chave da OpenAI nunca vai ao navegador.
// Sem OPENAI_API_KEY ou OPENAI_MODEL no .env, responde 503 e a tela usa o interpretador local.

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["desconto_pp", "contratos_pct", "contratos", "inadimplencia_pct", "resumo", "fora_do_escopo"],
  properties: {
    desconto_pp: { type: ["number", "null"], description: "Desconto na taxa, em pontos percentuais ao mês sobre o contrato" },
    contratos_pct: { type: ["number", "null"], description: "Variação % de contratos ativos no cenário com desconto" },
    contratos: { type: ["number", "null"], description: "Número absoluto de contratos no cenário com desconto" },
    inadimplencia_pct: { type: ["number", "null"], description: "Aumento % da perda esperada (inadimplência)" },
    resumo: { type: "string", description: "Uma frase em português descrevendo o que será ajustado" },
    fora_do_escopo: { type: "boolean" }
  }
};

const INSTRUCOES = `Você converte perguntas "e se…" sobre uma carteira de crédito em ajustes de simulação.
Ajustes possíveis: desconto na taxa (p.p.), contratos no cenário com desconto (% ou absoluto) e aumento da inadimplência (%).
Preencha só o que a pergunta disser explicitamente; o resto fica null. Nunca calcule resultados nem invente números.
Se a pergunta não tratar desses ajustes, marque fora_do_escopo = true e explique em resumo.`;

export async function interpretarComOpenAI(texto, { chave, modelo, fetchFn = fetch }) {
  const resp = await fetchFn("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${chave}` },
    body: JSON.stringify({
      model: modelo,
      input: [{ role: "system", content: INSTRUCOES }, { role: "user", content: texto }],
      text: { format: { type: "json_schema", name: "ajustes_cenario", schema: SCHEMA, strict: true } }
    }),
    signal: AbortSignal.timeout(15000)
  });
  if (!resp.ok) throw new Error(`OpenAI ${resp.status}`);
  const dados = await resp.json();
  const msg = dados.output?.find((o) => o.type === "message");
  const txt = msg?.content?.find((c) => c.type === "output_text")?.text;
  if (!txt) throw new Error("resposta da OpenAI sem texto");
  return JSON.parse(txt);
}

// Plugin do Vite: registra a rota no servidor de desenvolvimento
export const rotaInterpretar = (env) => ({
  name: "rota-interpretar",
  configureServer(server) {
    server.middlewares.use("/api/interpretar", async (req, res) => {
      const enviar = (status, corpo) => {
        res.statusCode = status; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(corpo));
      };
      if (req.method !== "POST") return enviar(405, { erro: "use POST" });
      if (!env.OPENAI_API_KEY || !env.OPENAI_MODEL) return enviar(503, { erro: "IA não configurada" });
      let corpo = "";
      for await (const parte of req) corpo += parte;
      try {
        const { texto } = JSON.parse(corpo || "{}");
        if (!texto || String(texto).length > 500) return enviar(400, { erro: "texto vazio ou longo demais" });
        enviar(200, await interpretarComOpenAI(String(texto), { chave: env.OPENAI_API_KEY, modelo: env.OPENAI_MODEL }));
      } catch (e) {
        enviar(502, { erro: e.message });
      }
    });
  }
});
