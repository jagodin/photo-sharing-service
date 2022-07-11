FROM public.ecr.aws/lambda/nodejs:14 as build
WORKDIR /build
COPY /functions/migrate/package-lock.json /functions/migrate/package.json ./
COPY /prisma ./prisma
RUN npm ci
COPY . .
RUN npx esbuild functions/migrate/index.ts --bundle --outdir=dist --platform=node --external:aws-sdk --external:@prisma/client --external:prisma

FROM public.ecr.aws/lambda/nodejs:14
WORKDIR ${LAMBDA_TASK_ROOT}

COPY /functions/migrate/package-lock.json /functions/migrate/package.json ./
COPY /prisma ./prisma
RUN npm ci --production
COPY --from=build /build/dist .
COPY . .

CMD ["index.handler"]
