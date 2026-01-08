import UserService from '../../services/userService.js';
import pool from '../../config/db.js';

describe('UserService Unit Tests', () => {
  let testUser;

  beforeAll(async () => {
    // Teszt felhasználó létrehozása
    testUser = await UserService.createUser({
      username: 'testuser',
      password: 'Test1234!',
      email: 'testuser@example.com',
    });
  });

  afterAll(async () => {
    // Takarítás: töröljük a teszt felhasználót
    if (testUser && testUser.id) {
      await pool.query('DELETE FROM users WHERE id = $1', [testUser.id]);
    }
    await pool.end();
  });

  test('should create a user successfully', async () => {
    expect(testUser).toHaveProperty('id');
    expect(testUser.username).toBe('testuser');
    expect(testUser.password).not.toBe('Test1234!'); // hashed password
  });

  test('should find user by username', async () => {
    const foundUser = await UserService.findByUsername('testuser');
    expect(foundUser).not.toBeNull();
    expect(foundUser.username).toBe('testuser');
  });

  test('should verify password correctly', async () => {
    const isValid = await UserService.verifyPassword(testUser, 'Test1234!');
    expect(isValid).toBe(true);

    const isInvalid = await UserService.verifyPassword(testUser, 'WrongPass');
    expect(isInvalid).toBe(false);
  });

  test('should find user by id', async () => {
    const foundById = await UserService.findById(testUser.id);
    expect(foundById.username).toBe('testuser');
  });
});
