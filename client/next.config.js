// next.config.js
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

module.exports = withPlugins([[withImages, { fileExtensions: ['jpg', 'jpeg', 'png', 'gif'] }]], {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
  images: {
    // development purpose
    domains: [
      'cdn.pixabay.com',
      'www.jacksonhole.com',
      'www.ecpi.edu',
      'c8.alamy.com',
      'visitmalone.com',
    ],
  },
});
