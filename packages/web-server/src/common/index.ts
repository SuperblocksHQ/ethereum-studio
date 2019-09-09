import path from 'path';

// Public directory setting makes it possible to set a different www directory,
// by reading from the PUBLIC_DIR environment variable, if available;
// It considers the value could be referencing a relative path.
//
// This setting enables running the web-server alone for development and testing.
//
// Apart from the cases of local development and testing,
// __dirname is still to be used (legacy setting as default)
export const publicDirectory = path.resolve(process.env.PUBLIC_DIR || path.join(__dirname, '../'));
