FROM node:16-bullseye-slim AS build
WORKDIR /ignite

# Copy all relevant package.json files to the new the image
RUN apt -y update && apt install -y git
COPY ./package.json yarn.lock ./
COPY ./packages/desktop/package.json ./packages/desktop/
COPY ./packages/backend/package.json ./packages/backend/package.json
COPY ./packages/mobile/package.json ./packages/backend/package.json
COPY ./lerna.json ./

# Install all top-level dependencies and copy source
RUN yarn install --frozen-lockfile --network-timeout 100000
COPY . .

# Install project-level dependencies to properly resolves modules for
# next-transpile-modules and build the app. Note: copying source after
# `yarn install` leads to a build error from `next-transpile-modules`.
WORKDIR /ignite/packages/desktop
RUN yarn install
RUN yarn build

FROM node:16-bullseye-slim AS runner
WORKDIR /app

ARG commit_hash
ENV COMMIT_HASH=$commit_hash

ENV NODE_ENV production
EXPOSE 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /ignite/packages/desktop/public ./
COPY --from=build /ignite/packages/desktop/package.json ./

COPY --from=build --chown=nextjs:nodejs /ignite/packages/desktop/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /ignite/packages/desktop/.next/static ./packages/desktop/.next/static

COPY --from=build /ignite/packages/desktop/next.config.js ./packages/desktop
COPY --from=build --chown=nextjs:nodejs /ignite/packages/desktop/app/lib/injectConfig.js ./packages/desktop/
COPY --from=build --chown=nextjs:nodejs /ignite/packages/desktop/app/lib/entrypoint.sh ./packages/desktop/

USER nextjs

WORKDIR /app/packages/desktop

ENTRYPOINT ["./entrypoint.sh"]

CMD ["node", "server.js"]
