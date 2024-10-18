import express from 'express'
import routes from './routes'
import path from 'path'
import { config } from "dotenv"
const cors = require('cors');
import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { i18nMiddleware } from './e_middlewares/i18n'
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import ErrorHandler from './e_middlewares/ErrorHandler';

// load '.env'
//----------------------------------------------------------------------
config({ path: path.resolve(__dirname, './.env') });
//----------------------------------------------------------------------

// database
//------------------------------------------------------------------------
const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: [path.join(__dirname, "a_entities/*.ts")],
  migrations: [path.join(__dirname, "a_entities/migrations/*.ts")],
  migrationsTableName: "migrations_table",
} as DataSourceOptions )

export { AppDataSource }

AppDataSource.initialize()
//------------------------------------------------------------------------

// express server
//----------------------------------------------------------------------
const app = express()
const PORT = process.env.ACCOUNTS_PORT

// cors (authorized domain)
const corsOptions = {
  origin: [
    `${process.env.DOMAIN_ORIGIN}`,
    `${process.env.NGINX_HOST}:${process.env.NGINX_PORT}`,
    `${process.env.DOCUMENTATION_HOST}:${process.env.DOCUMENTATION_PORT}`
  ],
  methods: ['*']
};
app.use(cors(corsOptions));
//----------------------------------------------------------------------

// middlewares (INIT)
// =============================================================================

// translation
//----------------------------------------------------------------------
app.use(i18nMiddleware)
//----------------------------------------------------------------------

// rate limiter
//----------------------------------------------------------------------
export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100, // 100 req
  message: (req: Request, res: Response) => ({
    status: "error",
    code: 429,
    message: req.t('too_many_requests'),
  }),
  keyGenerator: (req: Request) => {
    const forwarded = req.headers['x-forwarded-for'];

    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0];
    } else if (Array.isArray(forwarded)) {
      return forwarded[0];
    }
    return req.ip || 'unknown';
  },
});

app.use(rateLimiter);
//----------------------------------------------------------------------

// use json
//----------------------------------------------------------------------
app.use(express.json())
//----------------------------------------------------------------------

// =============================================================================
// middlewares (END)

// run server
//----------------------------------------------------------------------
// microservice main route
app.use('/accounts', routes)

// error handler
//----------------------------------------------------------------------
app.use(ErrorHandler);
//----------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`*** RUNING ON : ${process.env.ACCOUNTS_HOST}:${PORT} ***`)
})
//----------------------------------------------------------------------