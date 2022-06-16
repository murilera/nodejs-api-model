module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 100000],
    'body-max-line-length': [0, 'always', 100000]
  }
}
