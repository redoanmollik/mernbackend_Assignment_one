# User Management REST API

A simple CRUD API for the Backend Development with Node.js assignment, built with Express.js, TypeScript, Prisma ORM and MongoDB.

## Requirements

- Node.js 18 or newer
- MongoDB Atlas account/cluster or a local MongoDB database

## Setup

1. Clone this repository and enter its folder:

   ```bash
   git clone https://github.com/redoanmollik/mernbackend_Assignment_one.git
   cd mernbackend_Assignment_one
   ```

2. Install packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `DATABASE_URL` to your MongoDB connection string. Do not commit `.env`.

   ```bash
   cp .env.example .env
   ```

4. Generate Prisma Client and create/sync the MongoDB collection:

   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The API runs at `http://localhost:3000`. For a production build, run `npm run build` and then `npm start`.

## User model

`User` has a MongoDB ObjectId `id`, `name`, unique `email`, and integer `age`.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/users` | Create a user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get one user |
| PATCH | `/api/users/:id` | Update supplied user fields |
| DELETE | `/api/users/:id` | Delete a user |

### Example requests

Create a user (`POST /api/users`, JSON):

```json
{
  "name": "Rahim",
  "email": "rahim@gmail.com",
  "age": 22
}
```

Update a user (`PATCH /api/users/:id`, JSON):

```json
{
  "name": "Rahim Ahmed",
  "age": 23
}
```

Successful create returns `201`; reads/updates return `200`; delete returns a success message. Validation errors return `400`, missing users `404`, and duplicate emails `409`.

## Postman testing

Import `postman/User-CRUD-API.postman_collection.json` into Postman. Set the collection variable `baseUrl` (default `http://localhost:3000`). The collection contains all five endpoint requests and uses the created user's ID for subsequent requests. Run the requests in order: Create, Get all, Get one, Update, Delete. Capture your own Postman response screenshots after configuring a working MongoDB connection; screenshots are not included because they require running the API against your personal database.
