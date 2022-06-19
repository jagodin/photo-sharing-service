import type { PropsWithChildren } from 'react';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

export const links: LinksFunction = () => {
  return [{ rel: 'icon', href: '/_static/favicon.ico' }];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'URL Shortener',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

const Document = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, backgroundColor: '#f9f9f9' }}>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};
