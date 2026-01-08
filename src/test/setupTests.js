import '@testing-library/jest-dom';

// Mock config for Jest
jest.mock('../config.js', () => ({
  default: {
    apiUrl: 'http://localhost:3000/api',
    clientUrl: 'http://localhost:3001',
    sessionSecret: 'test_secret',
    nodeEnv: 'test',
  },
}));
