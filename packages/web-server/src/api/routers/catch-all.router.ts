import express, { Request, Response } from 'express';
import path from 'path';
import { InjectEnvVariablesCommand } from '../../app';
import { publicDirectory } from '../../common';

// Default "catch-all" route serving the Ethereum Studio editor
export const catchAllRouter = express.Router();

catchAllRouter.get('/*', async (_req: Request, res: Response) => {
    const command = new InjectEnvVariablesCommand();
    await command.execute();
    res.sendFile(path.join(publicDirectory, 'index.html'));
});
