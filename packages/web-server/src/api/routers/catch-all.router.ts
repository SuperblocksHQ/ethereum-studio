import express, { Request, Response } from 'express';
import path from 'path';
import { publicDirectory } from '../../common';

// Default "catch-all" route serving the Superblocks Dashboard
export const catchAllRouter = express.Router();

catchAllRouter.get('/*', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicDirectory, 'index.html'));
});
