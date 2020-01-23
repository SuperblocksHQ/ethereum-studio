import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { publicDirectory } from '../../common';
const readFileAsync = promisify(fs.readFile);

export class InjectEnvVariablesCommand {

    async execute() {
        const filePath = path.join(publicDirectory, 'index.html');
        const file = await readFileAsync(filePath, 'utf8');

        const envVariables = {
            AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
            API_BASE_URL: process.env.API_BASE_URL
        };

        // Inject environment variables into index.html and send response
        return file.replace(/__ENV_VARIABLES__/g, JSON.stringify(envVariables));
    }
}
