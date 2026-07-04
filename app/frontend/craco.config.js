const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Ищем правила обработки стилей и запрещаем им лезть в tailwindcss
      const styleRules = webpackConfig.module.rules.find(r => r.oneOf)?.oneOf;
      if (styleRules) {
        const cssRule = styleRules.find(r => r.test && r.test.toString().includes('css'));
        if (cssRule) {
          cssRule.exclude = /node_modules\/tailwindcss/;
        }
      }
      return webpackConfig;
    },
  },
};