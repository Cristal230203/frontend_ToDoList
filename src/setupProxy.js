const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://todolist-backend-2k8o.onrender.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '/api',
      },
    })
  );
};