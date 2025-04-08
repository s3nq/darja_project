import fs from 'fs'
import path from 'path'
import { query } from './database'

const runMigrations = async () => {
	const dir = path.join(__dirname, 'migrations')
	const files = fs.readdirSync(dir).sort()

	for (const file of files) {
		const sql = fs.readFileSync(path.join(dir, file), 'utf8')
		console.log(`⏳ Running ${file}...`)
		await query(sql)
	}
	console.log('✅ All migrations applied!')
}

runMigrations().catch(console.error)
