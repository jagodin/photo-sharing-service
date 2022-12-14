import type { Handler } from 'aws-lambda';
import { execFile } from 'child_process';
import path from 'path';

export const handler: Handler = async (event, _) => {
  try {
    const migrateExitCode = await new Promise((resolve, _) => {
      execFile(
        path.resolve('./node_modules/prisma/build/index.js'),
        ['migrate', 'deploy'],
        (error, stdout, stderr) => {
          console.log(stdout);
          if (error != null) {
            console.log(`prisma migrate exited with error ${error.message}`);
            resolve(error.code ?? 1);
          } else {
            resolve(0);
          }
        }
      );
    });

    if (migrateExitCode !== 0)
      throw Error(`command failed with exit code ${migrateExitCode}`);
    console.info('Database migration successful');
  } catch (e) {
    console.log(e);
    throw e;
  }
};
