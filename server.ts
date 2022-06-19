import * as build from '@remix-run/dev/server-build';
import { createRequestHandler } from '@remix-run/express';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import serverless from 'serverless-http';

const app = express();
app.use(compression());
app.disable('x-powered-by');

app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' })
);

app.use(express.static('public', { maxAge: '1h' }));
app.use(morgan('tiny'));

app.all('*', createRequestHandler({ build, mode: process.env.NODE_ENV }));

if (process.env.NODE_ENV === 'development') {
  app.listen(3000, () => {
    console.info('Server listening on http://localhost:3000/');
  });
} else {
  module.exports.handler = serverless(app);
}
