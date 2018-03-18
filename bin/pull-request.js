const YAML = require('yamljs');

const Contents = require('../api/contents');
const Refs = require('../api/refs');
const PullRequests = require('../api/pull-requests');

const createPullRequest = async (repoName) => {
  // get file content
  const filePath = '.travis.yml';
  let file;
  try {
    file = await Contents.getFile(repoName, filePath);
    console.log(`-> Downloaded '${filePath}' file`);
  } catch (e) {
    console.log('-> Terminated: file not found');
    return;
  }

  // create a new branch
  const masterBranch = await Refs.getBranch(repoName, 'master');
  const branchName = 'update-travis-slack-noti';
  try {
    await Refs.createBranch(repoName, masterBranch, branchName);
    console.log(`-> Created '${branchName}' branch`);
  } catch (e) {
    console.log(`-> Terminated: '${branchName}' branch already existed`);
    return;
  }

  // update file content
  const content = YAML.parse(Buffer.from(file.content, 'base64').toString());
  if (!content.notifications || !content.notifications.slack) {
    console.log('-> Terminated: no slack notifications found');
    return;
  }
  if (content.notifications.slack.on_pull_requests !== undefined) {
    console.log('-> Terminated: on_pull_requests has been set');
    return;
  }
  content.notifications.slack.on_pull_requests = false;
  console.log(`-> Updated '${filePath}' content`);

  // push changes
  try {
    await Contents.updateFile(repoName, filePath, {
      branch: branchName,
      message: 'ci(travis): turn off slack noti on pull requests',
      content: Buffer.from(YAML.stringify(content, 4)).toString('base64'),
      sha: file.sha,
      committer: {
        name: process.env.COMMITTER_NAME,
        email: process.env.COMMITTER_EMAIL,
      },
    });
    console.log(`-> Pushed changes to '${branchName}'`);
  } catch (e) {
    console.log(`-> Terminated: failed to push changes to '${branchName}' branch`);
  }

  // create a pull request
  const pullRequestName = 'ci(travis): turn off slack noti on pull requests';
  const pullRequest = await PullRequests.createPullRequest(repoName, {
    title: pullRequestName,
    head: branchName,
    base: 'master',
  });
  console.log(`-> Created pull request at '${pullRequest.url}'`);

  return true;
};

module.exports = {
  createPullRequest,
};
