import { createServer } from 'http';
import expressApp from './server-express.js';

export const httpServer = createServer(expressApp);

