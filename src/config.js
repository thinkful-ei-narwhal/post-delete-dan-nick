module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV === 'production' ? 'tiny' : 'common',
  API_TOKEN: process.env.API_TOKEN
};  