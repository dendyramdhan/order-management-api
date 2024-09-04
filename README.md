
# Order Management API

This project is a backend API for managing orders and products, built using **Node.js**, **Express**, and **TypeScript**. The API provides functionality to create, update, view, and delete orders and products. It follows a clean architecture with **Dependency Injection** using `tsyringe`, proper error handling, logging, and includes features such as **database migrations** and **Swagger documentation**.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
- [Database Setup](#database-setup)
- [Swagger Documentation](#swagger-documentation)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [License](#license)

## Features

- **CRUD** for Orders and Products.
- **Dependency Injection** with `tsyringe`.
- **TypeScript** for type safety.
- **Sequelize ORM** for SQLite database management.
- **Database migrations** and seeders.
- **Validation** using DTOs and middleware.
- **Logging** with a custom logger.
- **Swagger** for API documentation.
- **Transaction Handling** to ensure data consistency.
- **Configurable** through environment variables.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14.x or later)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started)
- [SQLite](https://www.sqlite.org/index.html) (or configure your preferred DBMS)

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/order-management-api.git
   cd order-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```bash
NODE_ENV=development
PORT=3000
```

The database configuration can be found in `src/config/config.json`.

### Running the Project

To start the server in development mode:

```bash
npm run dev
```

For a production build, first compile the TypeScript files, then start the server:

```bash
npm run build
npm start
```

## Database Setup

This project uses **Sequelize ORM** with **SQLite** (or your configured database). You can run the migrations and seeders using the following commands:

1. Run migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

2. Run seeders to populate the database with initial data:

   ```bash
   npx sequelize-cli db:seed:all
   ```

3. If you need to rollback migrations:

   ```bash
   npx sequelize-cli db:migrate:undo:all
   ```

## Swagger Documentation

The API documentation is available through Swagger. After starting the server, you can view it at:

```
http://localhost:3000/api-docs
```

To modify or extend the Swagger documentation, edit the `swagger.yaml` file located in the `docs/` directory.

## Running Tests

You can add and run tests using your preferred testing framework, such as Jest or Mocha. For now, the project focuses on the core API implementation.

## Project Structure

Here is an overview of the key folders and files in the project:

```
.
├── src
│   ├── config              # Configuration files
│   ├── controllers         # API request controllers
│   ├── dtos                # Data Transfer Objects (for request validation)
│   ├── models              # Sequelize models
│   ├── repositories        # Repositories for data persistence logic
│   ├── routes              # Express routes
│   ├── services            # Business logic services
│   ├── middlewares         # Request validation and logging middleware
│   ├── utils               # Logger and helper utilities
│   ├── server.ts           # Main entry point for the application
├── migrations              # Sequelize migrations
├── seeders                 # Sequelize seeders
├── docs                    # Swagger YAML file for API documentation
├── .env                    # Environment variables
├── .gitignore              # Ignored files for Git
├── README.md               # Project documentation
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
```

## Technologies

- **Node.js** and **Express**: For building the API.
- **TypeScript**: For type safety.
- **Sequelize ORM**: For database interaction with support for migrations and seeders.
- **SQLite**: Default database (can be configured to use other databases).
- **tsyringe**: For Dependency Injection.
- **class-validator** and **class-transformer**: For request validation.
- **Swagger**: For API documentation.
- **Winston**: For logging.

## License

This project is licensed under the MIT License.
