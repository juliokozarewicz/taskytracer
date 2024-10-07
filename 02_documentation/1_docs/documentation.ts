const packageJson = require('../package.json');

// domains and ports
const TTTESTEEE_domain = `${process.env.DOCUMENTATION_HOST}:${process.env.DOCUMENTATION_PORT}`

const documentation = {
  // configs
  "openapi": "3.0.0",
  "info": {
    "title": packageJson.name.toUpperCase(), 
    "version": packageJson.version, 
    "description": "Tasky Tracer is a secure API designed for efficient task management. It features user authentication through JSON Web Tokens (JWT) and supports full Create, Read, Update, and Delete (CRUD) operations for managing to-do items. The API also provides functionalities for task prioritization, filtering, and collaboration, thereby enhancing productivity for both individuals and teams. This user-friendly API streamlines task management processes, making it a valuable tool for enhancing organizational efficiency."
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
        "summary": "*****",
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "tags": ["***** TAG *****"],
        servers: [
          { url: TTTESTEEE_domain}
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