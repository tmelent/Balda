module.exports = {
  env: {
    SOCKET_URL: 'http://localhost:4000',
    THIS_DOMAIN: 'http://localhost:3000'
  },

  webpack(config, options){
      config.module.rules.push({
          test: /\.mp3$/,
        use: {
          loader: 'file-loader',
        },
      });
      config.module.browser.push()
      return config;
  }
}