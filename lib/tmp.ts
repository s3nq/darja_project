import { mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

export async function createTempDir() {
	return await mkdtemp(join(tmpdir(), 'darja_zip_'))
}
