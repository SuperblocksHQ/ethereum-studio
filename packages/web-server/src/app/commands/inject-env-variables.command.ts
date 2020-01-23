import path from 'path';
import fs from 'fs';
import { publicDirectory } from '../../common';

export class InjectEnvVariablesCommand {

    async execute() {
        const filePath = path.join(publicDirectory, 'index.html');

        fs.readFile(filePath, 'utf8', (readErr, file) => {
            if (readErr) { throw readErr; }

            const envVariables = {
                AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY,
                API_BASE_URL: process.env.API_BASE_URL
            };

            // Inject environment variables into index.html
            file = file.replace(/__ENV_VARIABLES__/g, JSON.stringify(envVariables));

            fs.writeFile(filePath, file, 'utf-8', (writeErr) => {
                if (writeErr) { throw writeErr; }
            });
        });
    }
}
