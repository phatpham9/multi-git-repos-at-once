const { $get, $put } = require('./base');

const getFile = async (repoName, filePath) => await $get(`/repos/${repoName}/contents/${filePath}`);

const updateFile = async (repoName, filePath, file) => await $put(`/repos/${repoName}/contents/${filePath}`, file);

module.exports = {
  getFile,
  updateFile,
};
