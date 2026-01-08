// jest.config.js
export default {
  // React tesztekhez a jsdom a megfelelő környezet
  testEnvironment: 'jsdom',

  // Teszt setup fájl, minden teszt előtt lefut
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],

  // Babel használata a JSX/ESM fájlokhoz
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },

  // Node_modules-ban az axios-t is transzformálja ESM miatt
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',
  ],

  // Gyökérkönyvtár
  rootDir: '.',

  // Hol keresse a teszteket
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Ha szükséges, aliasokat is hozzáadhatsz a modulokhoz
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  // Teszt futtatásakor ESM modulokat engedélyez
  extensionsToTreatAsEsm: ['.js', '.jsx'],
};
