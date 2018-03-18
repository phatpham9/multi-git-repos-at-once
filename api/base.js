const fetch = require('node-fetch');

const request = async (uri, method, body) => {
  const res = await fetch(`${process.env.GITHUB_API_URL}${uri}`, {
    method,
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();

  if (!res.ok) {
    throw json;
  }

  return json;
};

const $get = async uri => await request(uri, 'GET');
const $post = async (uri, body) => await request(uri, 'POST', body);
const $put = async (uri, body) => await request(uri, 'PUT', body);
const $delete = async (uri, body) => await request(uri, 'DELETE', body);

module.exports = {
  $get,
  $post,
  $put,
  $delete,
};
