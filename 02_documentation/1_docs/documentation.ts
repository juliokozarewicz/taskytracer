const packageJson = require('../package.json');

// domains and ports
const *****_domain = `${process.env.*****}:${process.env.*****}`

const documentation = {
  // configs
  "openapi": "3.0.0",
  "info": {
    "title": packageJson.name.toUpperCase(), 
    "version": packageJson.version, 
    "description": packageJson.description
  },
  // components, security etc...
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "BearerAuth": []
    }
  ],
  // endpoints
  "paths": {
    // --------------------------------------------------
    "/*****": {
      "post": {
        "summary": "***** category *****",
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "tags": ["***** TAG *****"],
        servers: [
          { url: *****_domain}
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "*****": {
                    "type": "string",
                    "example": "*****"
                  },
                },
                "required": ["*****"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "'*****' created successfully",
            "content": {
              "application/json": {
                "examples": {
                  "successResponse": {
                    "value": {
                      "status": "success",
                      "code": 201,
                      "idCreated": "id",
                      "message": "'*****' created successfully",
                      "links": {
                        "self": "/*****",
                        "next": "/*****"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // --------------------------------------------------
  }
};

export default documentation;