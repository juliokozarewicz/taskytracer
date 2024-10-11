import express from 'express'
import routes from './routes'
import path from 'path'
import { config } from "dotenv"
const cors = require('cors');

// load '.env'
//----------------------------------------------------------------------
config({ path: path.resolve(__dirname, './.env') });
//----------------------------------------------------------------------

// express server
//----------------------------------------------------------------------
const app = express()
const PORT = process.env.HELLOWORLD_PORT

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

// use json
//----------------------------------------------------------------------
app.use(express.json())
//----------------------------------------------------------------------

// =============================================================================
// middlewares (END)

// run server
//----------------------------------------------------------------------
// microservice main route
app.use('/helloworld', routes)

app.listen(PORT, () => {
  console.log(`*** RUNING ON : ${process.env.HELLOWORLD_HOST}:${PORT} ***`)
})
//----------------------------------------------------------------------