# Emissor de Nota Fiscal - Mock

Módulo mock para demonstração, integrado ao SSO nTask IdP. Simula o fluxo de autenticação e navegação entre módulos.

## Pré-requisitos

- Node.js 20+
- pnpm (ou `corepack enable`)

## Desenvolvimento local

```bash
cd frontend
pnpm install
pnpm dev
```

Acesse http://localhost:5010

## Deploy no Cloud Run

O projeto inclui `cloudbuild-dev.yaml` para deploy no Google Cloud Build. Antes do primeiro deploy:

1. Execute `pnpm install` em `frontend/` para gerar `pnpm-lock.yaml` (builds reproduzíveis).
2. Rode o seeder OAuth no backend IdP: `php artisan db:seed --class=OAuthClientSeeder`
3. Configure o trigger do Cloud Build apontando para `cloudbuild-dev.yaml`.

URLs esperadas após deploy:
- `https://emissor-nota-fiscal-frontend-dev-XXXXX.us-central1.run.app`

## Variáveis de ambiente

Veja `.env.example` para referência.
