// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // minden /api hívás
    createProxyMiddleware({
      target: 'http://localhost:3000', // backend címe
      changeOrigin: true,
    })
  );
};
