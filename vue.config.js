const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

//Port pour écoute Docker
module.exports = {
  devServer: {
    port: 8081,
    host: '0.0.0.0',
  }
};
