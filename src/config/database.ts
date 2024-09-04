import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const env = process.env.NODE_ENV || 'development';

interface Config {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: string;
  storage?: string; // Only for SQLite databases
}

const config: { [key: string]: Config } = {
  development: {
    username: process.env.DB_USERNAME_DEV || 'root',
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_DATABASE_DEV || 'database_development',
    host: process.env.DB_HOST_DEV || '127.0.0.1',
    dialect: process.env.DB_DIALECT_DEV || 'sqlite',
    storage: process.env.DB_STORAGE_DEV || './database.sqlite', // SQLite requires storage
  },
  test: {
    username: process.env.DB_USERNAME_TEST || 'root',
    password: process.env.DB_PASSWORD_TEST || null,
    database: process.env.DB_DATABASE_TEST || 'database_test',
    host: process.env.DB_HOST_TEST || '127.0.0.1',
    dialect: process.env.DB_DIALECT_TEST || 'sqlite',
    storage: process.env.DB_STORAGE_TEST || ':memory:', // In-memory for testing
  },
  production: {
    username: process.env.DB_USERNAME_PROD || 'root',
    password: process.env.DB_PASSWORD_PROD || null,
    database: process.env.DB_DATABASE_PROD || 'database_production',
    host: process.env.DB_HOST_PROD || '127.0.0.1',
    dialect: process.env.DB_DIALECT_PROD || 'sqlite',
    storage: process.env.DB_STORAGE_PROD || './database.sqlite', // SQLite requires storage
  },
};

// Add this line for compatibility with CommonJS (Sequelize CLI uses this)
module.exports = config[env];

// Export default for TypeScript usage
export default config[env];