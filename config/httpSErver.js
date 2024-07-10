import { createServer } from 'http';
import expressApp from './server-express.js';

export const httpServer = createServer(expressApp);
// TODO: this file name should be httpServer.js instead of httpSErver.js

