import { defineConfig } from 'drizzle-kit';

// accessing .env.local
const dotenv = require('dotenv'); 
dotenv.config({ path: '.env.local' })

export default defineConfig({
  out: './src/drizzle',
  schema: './src/database/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})