# Shopify Announcement App - React Router

This is a Shopify embedded app built using the official Shopify React Router template.

The app allows merchants to:

- Save announcement text
- Store data in MongoDB using Prisma
- Sync data to Shopify Shop Metafields
- Fetch and display saved announcements

---

## Tech Stack

- Node.js (v18+ or v20+)
- Shopify CLI
- React Router
- Prisma ORM
- MongoDB Atlas
- Shopify Admin GraphQL API

---

## Prerequisites

Before you begin, make sure you have installed:

- Node.js (v18 or v20 recommended)
- Shopify CLI
- MongoDB Atlas account

Check Node version:

```shell
node -v
```

---

## Setup

### 1. Clone Repository

```shell
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2. Install Dependencies

```shell
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
DATABASE_URL="mongodb+srv://username:password@cluster0.mongodb.net/shopify-app?retryWrites=true&w=majority"

# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-tunnel-url.ngrok-free.app
SCOPES=read_metafields,write_metafields
```

Example MongoDB URL:

```
mongodb+srv://testuser:Test123@cluster0.abcde.mongodb.net/shopify-app?retryWrites=true&w=majority
```

---

### 4. Setup Prisma (MongoDB)

Generate Prisma Client:

```shell
npx prisma generate
```

Push schema to database:

```shell
npx prisma db push
```

Reset database (if required):

```shell
npx prisma db push --force-reset
```

---

## Local Development

Start development server:

```shell
shopify app dev
```

This will:

- Start local server
- Create secure tunnel
- Install app on development store

Press `P` to open the app preview.

---

## Authenticating and Querying Data

To authenticate and query Shopify data:

```js
export async function loader({ request }) {
  const { admin } = await shopify.authenticate.admin(request);

  const response = await admin.graphql(`
    {
      shop {
        name
      }
    }
  `);

  const data = await response.json();
  return data;
}
```

---

## Deployment

### Build Application

Using npm:

```shell
npm run build
```

---

### Deploy App

```shell
shopify app deploy
```

If you update scopes in `shopify.app.toml`, redeploy and reinstall the app.

---

## Required Scopes

In `shopify.app.toml`:

```
scopes = "read_metafields,write_metafields"
```

---

## Project Structure

```
app/
  routes/
  shopify.server.js
  db.server.js

prisma/
  schema.prisma

.env
shopify.app.toml
package.json
```

---

## Common Issues

### Prisma Client Error

```
npx prisma generate
```

---

### MongoDB Authentication Error

- Verify username and password
- Allow network access (0.0.0.0/0 in MongoDB Atlas)

---

### Metafield Permission Error

Ensure scopes include:

```
read_metafields
write_metafields
```

Then redeploy:

```
shopify app deploy
```



## Resources

- Shopify App React Router Docs  
- Shopify Admin GraphQL API  
- Prisma Documentation  
- MongoDB Atlas  
- Shopify CLI Documentation  

---

## License

This project is for development and production use.