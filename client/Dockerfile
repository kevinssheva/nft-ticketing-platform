FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /tmp/dev
COPY package.json bun.lockb /tmp/dev
RUN cd /tmp/dev && bun install --frozen-lockfile

FROM base AS release
COPY --from=install /tmp/dev/node_modules node_modules
COPY . .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "dev"]
