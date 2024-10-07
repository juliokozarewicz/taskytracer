import express from 'express'
import routes from './routes'
import path from 'path'
import { config } from "dotenv"
const cors = require('cors');

// load '.env'
//----------------------------------------------------------------------
config({ path: path.resolve(__dirname, './.env') })
config({ path: path.resolve(__dirname, '../01_nginx/.env') })
//----------------------------------------------------------------------

// express server
//----------------------------------------------------------------------
const app = express()
const PORT = process.env.HELLOWORLD_PORT

// cors (authorized domain)
const corsOptions = {
  gateway: `${process.env.NGINX_HOST}:${process.env.NGINX_PORT}`,
  documentation: `${process.env.DOCUMENTATION_HOST}:${process.env.DOCUMENTATION_PORT}`,
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
  console.log(`*** SERVER RUNING ON PORT: ${PORT} ***`)
})
//----------------------------------------------------------------------