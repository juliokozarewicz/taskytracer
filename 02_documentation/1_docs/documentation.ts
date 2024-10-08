const packageJson = require('../package.json');

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
    "/helloworld/helloworld": {
      "get": {
        "summary": "Get Hello World Message",
        "description": "Retrieves a hello world message. You can optionally provide a custom message via query parameter.",
        "tags": ["HelloWorld"],
        "parameters": [
          {
            "name": "message",
            "in": "query",
            "required": false,
            "description": "Custom message to be returned. Defaults to 'Hello World!!!' if not provided.",
            "schema": {
              "type": "string",
              "example": "Hello from the API!"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response with hello world message.",
            "content": {
              "application/json": {
                "examples": {
                  "successResponse": {
                    "value": {
                      "status": "success",
                      "code": 200,
                      "message": "Hello World!!!",
                      "links": {
                        "self": "/helloworld/helloworld"
                      }
                    }
                  },
                  "customMessageResponse": {
                    "value": {
                      "status": "success",
                      "code": 200,
                      "message": "Hello from the API!",
                      "links": {
                        "self": "/helloworld/helloworld"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // --------------------------------------------------
  }
};

export default documentation;