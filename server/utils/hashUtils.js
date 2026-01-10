import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const hashUtils = {
  async hash(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },
};

export default hashUtils;
