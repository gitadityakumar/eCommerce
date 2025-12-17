import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema/index'

dotenv.config({ path: '.env.local' })

// eslint-disable-next-line node/prefer-global/process
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
