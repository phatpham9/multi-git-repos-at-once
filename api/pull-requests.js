const { $post } = require('./base');

const createPullRequest = async (repoName, pullRequest) => await $post(`/repos/${repoName}/pulls`, pullRequest);

module.exports = {
  createPullRequest,
};
