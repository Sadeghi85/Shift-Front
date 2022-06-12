const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    client: {
      webSocketURL: "ws://0.0.0.0:8080/ws",
    },
    allowedHosts: "all",

    /* proxy: {
      "^/connect": {
        target: "https://sama.irib.ir/identity",
        changeOrigin: true,
      },
      "^/api": {
        target: "https://sama.irib.ir/webapi",
        changeOrigin: true,
      },
      "^/organizationchart": {
        target: "https//sama.irib.ir/organizationchart",
        changeOrigin: true,
      },
    }, */
  },

  transpileDependencies: true,

  publicPath:
    process.env.NODE_ENV === "production" ? process.env.VUE_APP_BASE_URL : "/",
});
