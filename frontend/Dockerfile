FROM node:20-alpine AS base

FROM base as dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY frontend/package.json frontend/yarn.lock* frontend/package-lock.json* frontend/pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base as builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY ./frontend .

ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base as runner

WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# facilitates using the same image for preview and production with client env from the host
COPY --from=builder /app/scripts ./scripts
RUN chmod +x ./scripts/entrypoint.sh
RUN apk add --no-cache bash

USER nextjs

EXPOSE 3000

ENV HOSTNAME "0.0.0.0"

ENV PORT 3000

ENTRYPOINT [ "./scripts/entrypoint.sh" ]

CMD ["node", "server.js"]