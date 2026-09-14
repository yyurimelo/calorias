# Calorias

Monorepo com npm workspaces.

## Estrutura

- `back/` — API Express + TypeScript
- `front/` — Next.js 16 + Tailwind 4

## Scripts

| Comando                | Descrição                            |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Sobe back e front juntos (concurrently) |
| `npm run dev:back`     | Só o back                            |
| `npm run dev:front`    | Só o front                           |
| `npm run build`        | Build dos dois                       |
| `npm run lint`         | Lint do front                        |

Instalar tudo a partir da raiz: `npm install`
