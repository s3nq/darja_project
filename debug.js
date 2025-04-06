require('dotenv').config({ path: '.env' })

console.log('PGPASSWORD (type):', typeof process.env.PGPASSWORD)
console.log('PGPASSWORD (value):', process.env.PGPASSWORD)
