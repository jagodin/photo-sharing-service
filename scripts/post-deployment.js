async function migrate() {
  return `npx sls invoke --function dbInit`;
}
async function postDeployment() {
  return await migrate();
}
module.exports = postDeployment;
