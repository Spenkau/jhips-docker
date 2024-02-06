function setupProxy({ tls }) {
  const serverResources = ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/auth', '/health'];
  const conf = [
    {
      context: serverResources,
      // target: `http${tls ? 's' : ''}://backend:8080`, // FOR ACCESS TO SERVER IN DOCKER CONTAINER
      target: `http://localhost:8080`, // FOR ACCESS TO SERVER AT LOCAL MACHINE
      secure: false,
      changeOrigin: tls,
    },
  ];
  return conf;
}
// TODO затронутые изменения в webpack/proxy.conf.js 6 и 7 строка backend:8080 и конфиги в config в backend
module.exports = setupProxy;
