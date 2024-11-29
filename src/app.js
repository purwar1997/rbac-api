import express from 'express';
import cookieParser from 'cookie-parser';
import setupLogger from './utils/setupLogger.js';
import setupSwagger from './utils/setupSwagger.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

setupLogger(app);
setupSwagger(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', apiRouter);
app.use(errorHandler);

export default app;
