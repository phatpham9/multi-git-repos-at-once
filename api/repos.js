const { $get } = require('./base');

const getMyRepos = async () => await $get('/user/repos');

module.exports = {
  getMyRepos,
};
