import fs from 'fs'
import path from 'path'
import { query } from './database'

const runMigration = async () => {
	const migrationFile = path.join(
		__dirname,
		'migrations/001_create_properties.sql'
	)
	const sql = fs.readFileSync(migrationFile, 'utf8')
	await query(sql)
	console.log('Migration applied successfully!')
}

runMigration().catch(console.error)
