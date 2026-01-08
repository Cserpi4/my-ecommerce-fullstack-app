// server/loader/index.js
import expressLoader from './express.js';
import setupSwagger from './swagger.js';

const loadApp = () => {
  const app = expressLoader();

  // Swagger
  setupSwagger(app);

  return app;
};

export default loadApp;
