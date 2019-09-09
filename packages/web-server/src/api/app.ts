import express from 'express';
require('express-async-errors'); // hack to make express handle exceptions in async functions
import compression from 'compression';
import path from 'path';
import { publicDirectory } from '../common';
import { catchAllRouter, robotsTxtRouter } from './routers';
const app = express();

// middlewares
app.use(compression());

// routes
app.use(express.static(path.join(publicDirectory, '.')));   // Static content
app.use(robotsTxtRouter);                                   // robots.txt
app.use(catchAllRouter);                                    // Editor

const port = parseInt(process.env.PORT, 10) || 80;
app.listen(port, () => console.log(`Superblocks Editor is listening on port ${port}\nPublic directory path set to ${publicDirectory}`));

// Enable imports for development and testing
export default app;
