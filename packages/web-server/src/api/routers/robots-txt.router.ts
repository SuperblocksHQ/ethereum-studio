import express, { Request, Response } from 'express';

export const robotsTxtRouter = express.Router();

robotsTxtRouter.get('/robots.txt', (_req: Request, res: Response) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow:');
});
