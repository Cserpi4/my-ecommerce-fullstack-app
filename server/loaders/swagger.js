import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url'; // Szükséges az ES modulokhoz

// 1. Definiáljuk a __dirname-t az ES modul környezetben
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupSwagger = app => {
  try {
    // 2. A HELYES ÚTVONAL KONSTRUKCIÓJA:
    // a. __dirname (server/loaders) -> b. .. (server) -> c. .. (project-root) -> d. swagger.yml
    const swaggerFile = path.join(__dirname, '..', '..', 'swagger.yml'); 
    
    // Ellenőrzés:
    // console.log('Searching for Swagger file at:', swaggerFile);

    const swaggerDocument = yaml.load(fs.readFileSync(swaggerFile, 'utf8'));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger UI available at /api-docs ✅');
  } catch (err) {
    console.error('Error loading Swagger file:', err);
  }
};

export default setupSwagger;
