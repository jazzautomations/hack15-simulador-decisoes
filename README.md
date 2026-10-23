# #15 Simulador de Decisões

**Objetivo:** Simular como mudanças comerciais afetam o resultado mensal de um negócio, comparando 3 cenários. Produto único, um mês, fórmulas determinísticas.

## Tech Stack
- **Vite + React 18** (dev server, HMR, build estático)
- **CSS puro** (sem Tailwind/bootstrap — bundle leve)
- **uvu** (testes — 5 assertions validam fórmula + input)
- Zero deps externas em runtime (offline-first)

## Setup
```bash
npm install
npm run dev      # http://localhost:3001
npm run build    # gera /dist
```

## Spec
### Entradas
- **Nome do produto** (string)
- **Preço unitário** (R$)
- **Quantidade vendida** (unidades/mês)
- **Custo fixo total** (R$/mês)
- **Custo variável/unitário** (R$)

### Cálculos
```
custo_total   = fixo + (variavel * quantidade)
receita       = preco * quantidade
lucro         = receita - custo_total
margem        = (lucro / receita) * 100
```

### 3 Cenários
1. **Cenário Atual** (base)
2. **Com Desconto** (preço unitário reduzido)
3. **Custo Alto** (custo variável aumentado)

### Exportações
- **JSON:** `{ base, ajustes, resultados }` → download automático
- **CSV:** colunas `cenario,preco,quantidade,custo_total,receita,lucro,margem_pct`

## Demo Flow (≤ 3 cliques)
1. `/#` preencher form → `Simular` → `/comparador`
2. Ajustar sliders → ver 3 cards atualizarem em tempo real
3. `Exportar CSV` → salvar → abrir no Excel/Sheets

## Testes
```bash
node test/calc.test.js
# 5 pass / 0 fail
```

## Estrutura
```
src/
├── main.jsx          # App root (form ↔ comparador)
├── lib/calc.js       # fórmulas + validação input
├── lib/schema.js     # validação produto
├── views/
│   ├── FormularioBase.jsx
│   └── Comparador.jsx
└── styles.css        # design system minimal
```

## Pendências (hackathon)
- [ ] Pitch deck: 3 cliques → 3 cenários → insight de margem
- [ ] GitHub repo + Actions deploy

## Metodologia do time

Como o squad multi-agente se organiza (worktrees, board, red team, cronograma 24h): [METODOLOGIA.md](METODOLOGIA.md)

## Nicho: fintech de crédito

| Desafio | Na carteira |
|---|---|
| Preço | receita mensal por contrato (juros + tarifa) |
| Quantidade | contratos ativos no mês |
| Custo variável | funding + perda esperada (mix A/B/C tabelado) + cobrança |
| Custos fixos | time + tecnologia + compliance |

Dados fictícios (já no formulário): contrato R$ 5.000, receita R$ 200, 3.000 contratos, variável R$ 120 (60 + 50 + 10), fixos R$ 150.000.

| Cenário | Resultado |
|---|---|
| Atual | R$ 90.000 |
| Desconto de 0,5 p.p. (receita R$ 175) | R$ 15.000 (−83%) |
| Inadimplência +50% (perda R$ 75) | R$ 15.000 (−83%) |

> "Dar 0,5 p.p. de desconto custa o mesmo que ver a inadimplência subir 50%."

Cálculo em `src/lib/credito.js`, testes em `test/credito.test.js`. Scoring por ML e explicação por LLM ainda não foram implementados.
