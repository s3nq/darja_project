import dotenv from 'dotenv'
dotenv.config()

import { Pool } from 'pg'

export const pool = new Pool({
	host: process.env.PG_HOST,
	port: parseInt(process.env.PG_PORT || '5432', 10),
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
})

export default pool
