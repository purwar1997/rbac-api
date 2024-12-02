import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import setupLogger from './utils/setupLogger.js';
import setupSwagger from './utils/setupSwagger.js';
import apiRouter from './routes/index.js';
import corsOptions from './utils/corsOptions.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

setupLogger(app);
setupSwagger(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', apiRouter);
app.use(errorHandler);

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Server is up and running',
  });
});

export default app;
