import { config } from 'dotenv';
import express from "express"
import path from "path"
import { rateLimiter } from "./rateLimiter"
import swaggerUi from "swagger-ui-express"
const cors = require('cors');

// load '.env'
//----------------------------------------------------------------------
config({ path: path.resolve(__dirname, './.env') });
config({ path: path.resolve(__dirname, '../01_nginx/.env') });
//----------------------------------------------------------------------

// express server
//----------------------------------------------------------------------
const app = express();
const PORT = process.env.DOCUMENTATION_PORT;

// cors (authorized domain)
const corsOptions = {
  gateway: `${process.env.NGINX_HOST}:${process.env.NGINX_PORT}`,
  documentation: `${process.env.DOCUMENTATION_HOST}:${process.env.DOCUMENTATION_PORT}`,
};
app.use(cors(corsOptions));
//----------------------------------------------------------------------

// middlewares (INIT)
// =============================================================================

// documentation
//----------------------------------------------------------------------
const packageJson = require('./package.json');
import documentation from "./1_docs/documentation";

const options = {
  customCss: `
    .topbar { display: none; }
    .swagger-ui { 
      max-width: 85%; 
      margin: auto;
    }
    .wrapper section { margin-bottom: 50px; }
  `,
  customSiteTitle: packageJson.name.toUpperCase(),
  
};

app.use(
  "/documentation/swagger",
  swaggerUi.serve,
  swaggerUi.setup(
    documentation,
    options
  )
)

// redocly
app.get('/documentation/json', (request, response) => {
  response.json(documentation);
});

app.get('/documentation/redocly', (request, response) => {
  const html = `
    <body>
      <div id="redoc-container"></div>
      <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0-rc.55/bundles/redoc.standalone.min.js"></script>
      <script src="https://cdn.jsdelivr.net/gh/wll8/redoc-try@1.4.9/dist/try.js"></script>
      <script>
        initTry({
          openApi: '${process.env.DOCUMENTATION_HOST}:${process.env.DOCUMENTATION_PORT}/documentation/json',
          redocOptions: {scrollYOffset: 50},
        })
      </script>
    </body>
  `;
  response.setHeader('Content-Type', 'text/html');
  response.send(html);
});
//----------------------------------------------------------------------

// rate limiter
//----------------------------------------------------------------------
app.use(rateLimiter);
//----------------------------------------------------------------------

// use json
//----------------------------------------------------------------------
app.use(express.json());
//----------------------------------------------------------------------

// =============================================================================
// middlewares (END)

// run server
//----------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`*** SERVER RUNING ON PORT: ${PORT} ***`);
});
//----------------------------------------------------------------------
