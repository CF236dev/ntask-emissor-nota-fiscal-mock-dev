FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN corepack enable pnpm && (test -f pnpm-lock.yaml && pnpm install --frozen-lockfile || pnpm install)

COPY . .

ARG NUXT_PUBLIC_IDP_BASE_URL=""
ARG NUXT_PUBLIC_IDP_FRONTEND_URL=""
ARG NUXT_PUBLIC_IDP_CLIENT_ID="emissor-nota-fiscal-client"
ARG NUXT_PUBLIC_PROCESSOS_URL=""

ENV NUXT_PUBLIC_IDP_BASE_URL=$NUXT_PUBLIC_IDP_BASE_URL
ENV NUXT_PUBLIC_IDP_FRONTEND_URL=$NUXT_PUBLIC_IDP_FRONTEND_URL
ENV NUXT_PUBLIC_IDP_CLIENT_ID=$NUXT_PUBLIC_IDP_CLIENT_ID
ENV NUXT_PUBLIC_PROCESSOS_URL=$NUXT_PUBLIC_PROCESSOS_URL

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]
