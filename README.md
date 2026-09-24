# Cronograma de Estudos do PDI

Página única em HTML/CSS/JS (sem build, sem dependências) para acompanhar o cronograma de estudos do PDI (Plano de Desenvolvimento Individual) — cursos, sessões de estudo, progresso por eixo e indicadores.

## Como usar

Abra `cronograma_pdi_completo.html` diretamente no navegador. Não há instalação nem build: é um arquivo estático autocontido.

Os dados (cursos marcados, sessões registradas, datas de pausa etc.) ficam salvos automaticamente no `localStorage` do navegador. Use os botões em "⚙️ Mais opções" para exportar/importar um backup em JSON ou gerar um arquivo `.ics` para a agenda.

## Estrutura

- `cronograma_pdi_completo.html` — aplicação completa (HTML, CSS e JS inline).
- `CLAUDE.md` — notas de arquitetura para quem for dar manutenção no código com auxílio do Claude Code.
