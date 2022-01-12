module.exports = {
  ...require('gts/.prettierrc.json'),
  overrides: [
    {
      files: ['*.md', 'README'],
      options: {
        parser: 'markdown-nocjsp',
      },
    },
    {
      files: ['*.mdx'],
      options: {
        parser: 'mdx-nocjsp',
      },
    },
  ],
};
