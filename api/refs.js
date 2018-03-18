const { $get, $post } = require('./base');

const getBranch = async (repoName, branchName) => await $get(`/repos/${repoName}/git/refs/heads/${branchName}`);

const createBranch = async (repoName, refBranch, branchName) => await $post(`/repos/${repoName}/git/refs`, {
  ref: `refs/heads/${branchName}`,
  sha: refBranch.object.sha,
});

module.exports = {
  getBranch,
  createBranch,
};
