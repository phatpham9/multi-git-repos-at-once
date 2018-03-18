require('dotenv').config();

const { sleep } = require('sleep');

const Repos = require('./api/repos');
const PullRequest = require('./bin/pull-request');

const ignoreRepos = [
  'gorillab/gunapp',
  'gorillab/javascript',
  'gorillab/project-guidelines',
  'gorillab/textAngular',
  'gorillab/gorilbot',
  'gorillab/gorillab.github.io',
  'gorillab/microauth-google',
  'gorillab/reader',
  'hackingdays/hackingdays.com',
  'hackingdays/telescope-theme-hd',
  'phatpham9/dashboard',
  'phatpham9/groupchat',
  'phatpham9/guestbook',
  'phatpham9/multi-git-repos-at-once',
  'phatpham9/bass-post-starter',
];

(async () => {
  try {
    // get all repos
    const myRepos = await Repos.getMyRepos();
    console.log('1. Got repos list');

    // create pull requests
    console.log('\n2. Creating pull requests...');
    const counter = {
      finished: 0,
      terminated: 0,
      skipped: 0,
    };
    for (let i = 0; i < myRepos.length; i++) {
      const repoName = myRepos[i].full_name;
      console.log(`\n   ${repoName}`);

      if (ignoreRepos.indexOf(repoName) !== -1) {
        counter.skipped += 1;
        console.log('-> Skipped');
      } else {
        const res = await PullRequest.createPullRequest(repoName);

        if (!res) {
          counter.terminated += 1;
        } else {
          counter.finished += 1;
        }
      }

      sleep(1);
    }

    console.log(`\n3. Finished: ${myRepos.length} total | ${counter.finished} finished | ${counter.terminated} terminated | ${counter.skipped} skipped`);
  } catch (e) {
    console.log('\n3. Got error', e);
  }
})();
