import express from 'express';
require('express-async-errors'); // hack to make express handle exceptions in async functions
import compression from 'compression';
import path from 'path';
import { publicDirectory } from '../common';
import { catchAllRouter, robotsTxtRouter } from './routers';
import { InjectEnvVariablesCommand } from 'app';
const app = express();

// middlewares
app.use(compression());

// routes
app.use(express.static(path.join(publicDirectory, '.')));   // Static content
app.use(robotsTxtRouter);                                   // robots.txt
app.use(catchAllRouter);                                    // Editor


async function injectEnvVariables() {
    const command = new InjectEnvVariablesCommand();
    await command.execute();
    console.log('Environmental variables injected');
}

injectEnvVariables().then(() => {
    const port = parseInt(process.env.PORT, 10) || 80;
    app.listen(port, () => console.log(`Ethereum Studio is listening on port ${port}\nPublic directory path set to ${publicDirectory}`));
});

// Enable imports for development and testing
export default app;
