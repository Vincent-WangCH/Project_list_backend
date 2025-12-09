# Project List Backend

A complete RESTful API backend built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL** (hosted on Neon). This project demonstrates clean architecture, type safety, and best practices for building production-ready backend applications.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon - Serverless PostgreSQL)
- **Development**: ts-node-dev (hot reload)

## 📁 Project Structure

```
project_list_backend/
├── src/
│   ├── index.ts                 # Application entry point (server startup)
│   ├── app.ts                   # Express app configuration and middleware
│   ├── routes/
│   │   └── items.routes.ts      # Item endpoint route definitions
│   ├── controllers/
│   │   └── items.controller.ts  # Request/response handling for items
│   ├── services/
│   │   └── items.service.ts     # Business logic and Prisma operations
│   ├── db/
│   │   └── prisma.ts            # PrismaClient singleton instance
│   └── middleware/
│       └── errorHandler.ts      # Centralized error handling
├── prisma/
│   └── schema.prisma            # Database schema definition
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies and scripts
```

## 🏗️ Architecture Overview

This project follows a **layered architecture** with clear separation of concerns:

### Request Flow

```
HTTP Request → Route → Controller → Service → Prisma → Database
                ↓          ↓           ↓         ↓
            URL Path   Validation   Business   Type-safe
                       Response     Logic      Queries
```

### Layer Responsibilities

1. **Routes** (`routes/`): Define API endpoints and HTTP methods
2. **Controllers** (`controllers/`): Handle HTTP requests/responses and validation
3. **Services** (`services/`): Contain business logic and database operations
4. **Database** (`db/`): Prisma client singleton for database access
5. **Middleware** (`middleware/`): Cross-cutting concerns (error handling, logging)

### How Prisma Connects to Neon PostgreSQL

1. **Configuration**: Database URL is stored in `.env` file and loaded via `prisma.config.ts`
2. **Connection**: Prisma Client establishes a connection pool to Neon PostgreSQL
3. **Communication**: Prisma Query Engine translates TypeScript/JavaScript calls to SQL
4. **Execution**: SQL queries are sent to Neon database over secure SSL connection
5. **Response**: Results are returned and automatically typed by Prisma Client

```
Your Code → Prisma Client → Query Engine → PostgreSQL Protocol → Neon Database
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```http
GET /health
```
**Response**: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get All Items
```http
GET /items
```
**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Item by ID
```http
GET /items/:id
```
**Response**: `200 OK` (if found) or `404 Not Found`
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Create New Item
```http
POST /items
Content-Type: application/json
```
**Request Body**:
```json
{
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop"
}
```
**Response**: `201 Created`
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Validation Rules**:
- `name`: Required, non-empty string
- `price`: Required, number greater than 0
- `description`: Optional string

### Update Item
```http
PUT /items/:id
Content-Type: application/json
```
**Request Body** (all fields optional):
```json
{
  "name": "Updated Laptop",
  "price": 1099.99,
  "description": "Updated description"
}
```
**Response**: `200 OK` (if found) or `404 Not Found`
```json
{
  "id": 1,
  "name": "Updated Laptop",
  "price": 1099.99,
  "description": "Updated description",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Validation Rules**:
- At least one field must be provided
- `name`: If provided, must be non-empty string
- `price`: If provided, must be greater than 0
- `description`: Optional string

### Delete Item
```http
DELETE /items/:id
```
**Response**: `200 OK` (if found) or `404 Not Found`
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

### Error Responses

All endpoints return consistent error responses:

**400 Bad Request** (Validation Error):
```json
{
  "error": "Name is required and must be a non-empty string"
}
```

**404 Not Found**:
```json
{
  "error": "Item not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal Server Error"
}
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Neon PostgreSQL** account (free tier available at [neon.tech](https://neon.tech))

### Step 1: Clone the Project

```bash
git clone <repository-url>
cd project_list_backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Neon PostgreSQL connection string:
```env
DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
PORT=3000
NODE_ENV=development
```

**How to get your Neon DATABASE_URL**:
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project (or use existing)
3. Navigate to "Connection Details"
4. Copy the connection string (it includes username, password, host, and database name)

### Step 4: Run Prisma Migrations

Generate the database schema and create tables:

```bash
npm run prisma:migrate
```

This will:
- Create the `Item` table in your Neon database
- Generate a migration file in `prisma/migrations/`

### Step 5: Generate Prisma Client

Generate the type-safe Prisma Client:

```bash
npm run prisma:generate
```

This creates TypeScript types based on your schema for full type safety.

### Step 6: Start Development Server

```bash
npm run dev
```

The server will start with hot reload enabled. You should see:
```
✅ Database connected successfully
🚀 Server is running
📡 Listening on port 3000
🔗 API URL: http://localhost:3000
🏥 Health check: http://localhost:3000/health
📦 Items API: http://localhost:3000/items
```

### Step 7: Test the API

You can test the API using:
- **Browser**: Visit `http://localhost:3000/health`
- **cURL**: `curl http://localhost:3000/items`
- **Postman**: Import the endpoints
- **Thunder Client** (VS Code extension)

## 🏭 Production Build

### Build the Project

Compile TypeScript to JavaScript:

```bash
npm run build
```

This creates optimized JavaScript files in the `dist/` folder.

### Run Production Server

```bash
npm start
```

This runs the compiled JavaScript from `dist/index.js`.

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server (requires build first) |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |

## 🧪 Testing the API

### Example: Create an Item

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop"
  }'
```

### Example: Get All Items

```bash
curl http://localhost:3000/items
```

### Example: Update an Item

```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1099.99
  }'
```

### Example: Delete an Item

```bash
curl -X DELETE http://localhost:3000/items/1
```

## 🔒 Security Best Practices

- ✅ Environment variables stored in `.env` (not committed to git)
- ✅ SSL/TLS connection to Neon database (`sslmode=require`)
- ✅ Input validation on all endpoints
- ✅ Centralized error handling (no sensitive data leaks)
- ✅ Type safety with TypeScript
- ✅ Prepared statements via Prisma (SQL injection protection)

## 🐛 Troubleshooting

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
- Verify your `DATABASE_URL` in `.env` is correct
- Check that your Neon database is active
- Ensure your IP is allowed (Neon allows all IPs by default)

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
- Change the `PORT` in `.env` to a different number (e.g., 3001)
- Or stop the process using port 3000

### Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npm run prisma:generate
```

## 📖 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon PostgreSQL](https://neon.tech/docs)

## 📝 License

ISC

## 👨‍💻 Author

Your Name

---

**Happy Coding! 🚀**

