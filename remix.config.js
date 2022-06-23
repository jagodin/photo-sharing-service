/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/static',
  publicPath: '/static/',
  serverBuildDirectory: 'server/build',
  devServerPort: 8002,
  server: './server.ts',
  serverBuildPath: 'build/index.js',
  ignoredRouteFiles: ['.*'],
  serverDependenciesToBundle: ['use-breakpoint'],
};
