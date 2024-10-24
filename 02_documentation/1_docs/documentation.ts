const packageJson = require('../package.json');

const documentation = {
  // configs
  openapi: "3.0.0",
  info: {
    title: packageJson.application_name.toUpperCase(),
    version: packageJson.version,
    description: packageJson.description,
  },
  // components, security etc...
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ],
  // endpoints
  paths: {
    // --------------------------------------------------
    "/helloworld/helloworld": {
      get: {
        summary: "Get hello world message",
        description: "Retrieves a hello world message. You can optionally provide a custom message via query parameter.",
        tags: ["HELLO WORLD"],
        parameters: [
          {
            name: "message",
            in: "query",
            required: false,
            description: "Custom message to be returned. Defaults to 'Hello World!!!' if not provided.",
            schema: {
              type: "string",
              example: "Hello from the API!"
            }
          }
        ],
        responses: {
          "200": {
            description: "Successful response with hello world message.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 200
                    },
                    message: {
                      type: "string",
                      example: "Hello World!!!"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/helloworld/helloworld"
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
    },
    // --------------------------------------------------
    "/tasks/category/create": {
      post: {
        summary: "Create a new category",
        description: "Creates a new category for tasks. Requires a category name.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["TASKS"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  categoryName: {
                    type: "string",
                    example: "finance"
                  }
                },
                required: ["categoryName"]
              }
            }
          }
        },
        responses: {
          "201": {
            description: "'category' created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 201
                    },
                    idCreated: {
                      type: "string",
                      example: "93e83b42-ada5-417b-b63a-a0891ba00d45"
                    },
                    message: {
                      type: "string",
                      example: "'category' created successfully"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/category/create"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/category/list-all"
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
    },
    // --------------------------------------------------
    "/tasks/category/list-all": {
      get: {
        summary: "List all categories",
        description: "Retrieves a list of all categories that have been created.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["TASKS"],
        responses: {
          "200": {
            description: "A list of categories retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 200
                    },
                    message: {
                      type: "string",
                      example: "data received successfully"
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            example: "93e83b42-ada5-417b-b63a-a0891ba00d45"
                          },
                          categoryName: {
                            type: "string",
                            example: "finance"
                          }
                        }
                      }
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: {
                          type: "integer",
                          example: 1
                        }
                      }
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/category/list-all"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/category/create"
                        },
                        prev: {
                          type: "string",
                          nullable: true,
                          example: null
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
    },
    // --------------------------------------------------
    "/tasks/category/delete/{categoryId}": {
      delete: {
        summary: "Delete a category by ID",
        description: "Deletes a specific category based on the provided category ID.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["TASKS"],
        parameters: [
          {
            name: "categoryId",
            in: "path",
            required: true,
            description: "ID of the category to delete.",
            schema: {
              type: "string",
              example: "93e83b42-ada5-417b-b63a-a0891ba00d45"
            }
          }
        ],
        responses: {
          "200": {
            description: "Category deleted successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 200
                    },
                    message: {
                      type: "string",
                      example: "successfully deleted"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/category/delete/{categoryId}"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/category/list-all"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/category/list-all"
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
    },
    // --------------------------------------------------
    "/tasks/create": {
      post: {
        summary: "Create a new task",
        description: "Creates a new task under a specified category. Requires task details.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["TASKS"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  taskName: {
                    type: "string",
                    description: "Name of the task",
                    example: "Finish report"
                  },
                  category: {
                    type: "string",
                    description: "Category of the task",
                    example: "Work"
                  },
                  description: {
                    type: "string",
                    description: "Detailed description of the task",
                    example: "Complete the final report for the project"
                  },
                  dueDate: {
                    type: "string",
                    description: "Due date for the task in YYYY-MM-DD format",
                    example: "2023-10-01"
                  },
                  statusName: {
                    type: "string",
                    description: "Status of the task",
                    example: "Pending"
                  }
                },
                required: ["taskName", "category", "dueDate", "statusName"]
              }
            }
          },
        },
        responses: {
          "201": {
            description: "Task created successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 201
                    },
                    message: {
                      type: "string",
                      example: "'Finish report' created successfully"
                    },
                    idCreated: {
                      type: "string",
                      example: "12345678-1234-1234-1234-123456789abc"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/create"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/list"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/create"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            description: "Conflict - Task already exists.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "error"
                    },
                    code: {
                      type: "integer",
                      example: 409
                    },
                    message: {
                      type: "string",
                      example: "'Finish report' already exists"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/create"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/list"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/create"
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
    },
    // --------------------------------------------------
    "/tasks/list": {
      get: {
        summary: "List all tasks based on provided filters",
        description: "Retrieves all tasks, optionally filtered by task name, category, status, and due dates.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["TASKS"],
        parameters: [
          {
            name: "taskname",
            in: "query",
            required: false,
            schema: {
              type: "string"
            }
          },
          {
            name: "category",
            in: "query",
            required: false,
            schema: {
              type: "string"
            }
          },
          {
            name: "description",
            in: "query",
            required: false,
            schema: {
              type: "string"
            }
          },
          {
            name: "initduedate",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date"
            }
          },
          {
            name: "endduedate",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date"
            }
          },
          {
            name: "status",
            in: "query",
            required: false,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "Data received successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 200
                    },
                    message: {
                      type: "string",
                      example: "data received successfully"
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            example: "22f70783-9891-4d64-a08c-c676e385616f"
                          },
                          taskName: {
                            type: "string",
                            example: "My Task"
                          },
                          category: {
                            type: "string",
                            example: "Work"
                          },
                          description: {
                            type: "string",
                            example: "This is a task description"
                          },
                          dueDate: {
                            type: "string",
                            example: "2023-10-01T00:00:00Z"
                          },
                          statusName: {
                            type: "string",
                            example: "Completed"
                          }
                        }
                      }
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: {
                          type: "integer",
                          example: 1
                        }
                      }
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/list"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/list"
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
    },
    // --------------------------------------------------
    "/tasks/update/{updateId}": {
      patch: {
        summary: "Update an existing task",
        description: "Updates the details of an existing task specified by its ID.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["TASKS"],
        parameters: [
          {
            name: "updateId",
            in: "path",
            required: true,
            description: "ID of the task to be updated.",
            schema: {
              type: "string",
              example: "22f70783-9891-4d64-a08c-c676e385616f"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  taskName: {
                    type: "string",
                    example: "New Task Name"
                  },
                  category: {
                    type: "string",
                    example: "finance"
                  },
                  description: {
                    type: "string",
                    example: "Updated description of the task"
                  },
                  dueDate: {
                    type: "string",
                    format: "date",
                    example: "2024-10-10"
                  },
                  statusName: {
                    type: "string",
                    example: "completed"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Task updated successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 200
                    },
                    message: {
                      type: "string",
                      example: "'New Task Name' updated successfully"
                    },
                    idUpdated: {
                      type: "string",
                      example: "22f70783-9891-4d64-a08c-c676e385616f"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/update/22f70783-9891-4d64-a08c-c676e385616f"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/list"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/list"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            description: "Task not found.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "error"
                    },
                    code: {
                      type: "integer",
                      example: 404
                    },
                    message: {
                      type: "string",
                      example: "task not found"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/tasks/update/22f70783-9891-4d64-a08c-c676e385616f"
                        },
                        next: {
                          type: "string",
                          example: "/tasks/list"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/list"
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
    },
    // --------------------------------------------------
    "/tasks/delete/{deleteId}": {
      delete: {
        summary: "Delete a task by ID",
        description: "Deletes a specific task identified by its ID.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["TASKS"],
        parameters: [
          {
            name: "deleteId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "22f70783-9891-4d64-a08c-c676e385616f"
            }
          }
        ],
        responses: {
          "200": {
            description: "Task deleted successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 200
                    },
                    message: {
                      type: "string",
                      example: "successfully deleted"
                    },
                    links: {
                      type: "object",
                      properties: {
                        next: {
                          type: "string",
                          example: "/tasks/list"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/list"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            description: "Task not found.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "error"
                    },
                    code: {
                      type: "integer",
                      example: 404
                    },
                    message: {
                      type: "string",
                      example: "task not found"
                    },
                    links: {
                      type: "object",
                      properties: {
                        next: {
                          type: "string",
                          example: "/tasks/list"
                        },
                        prev: {
                          type: "string",
                          example: "/tasks/list"
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
    },
    // --------------------------------------------------
    "/accounts/signup": {
      post: {
        summary: "Create a new account",
        description: "Creates a new user account. If the user already exists, a new activation email will be sent.",
        tags: ["ACCOUNTS"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "John Doe"
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john.doe@example.com"
                  },
                  password: {
                    type: "string",
                    example: "strongpassword123"
                  },
                  link: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/activate"
                  }
                },
                required: ["name", "email", "password", "link"]
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Account created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 201
                    },
                    message: {
                      type: "string",
                      example: "Account created successfully"
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/accounts/signup"
                        },
                        next: {
                          type: "string",
                          example: "/accounts/login"
                        },
                        prev: {
                          type: "string",
                          example: "/accounts/login"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Invalid input data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "error"
                    },
                    code: {
                      type: "integer",
                      example: 400
                    },
                    message: {
                      type: "string",
                      example: "Invalid input data"
                    }
                  }
                }
              }
            }
          },
          "409": {
            description: "User already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "error"
                    },
                    code: {
                      type: "integer",
                      example: 409
                    },
                    message: {
                      type: "string",
                      example: "User already exists"
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
    "/accounts/resend-code": {
      post: {
        summary: "Resend activation email code",
        description: "Sends a new activation email code to the specified email address. The email must be registered in the system.",
        security: [
          {
            BearerAuth: []
          }
        ],
        tags: ["ACCOUNTS"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com"
                  },
                  link: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/activate"
                  }
                },
                required: ["email", "link"]
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Activation email code resent successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success"
                    },
                    code: {
                      type: "integer",
                      example: 201
                    },
                    message: {
                      type: "string",
                      example: "Please activate your account through the link sent to your email."
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/accounts/resend-code"
                        },
                        next: {
                          type: "string",
                          example: "/accounts/activate-email"
                        },
                        prev: {
                          type: "string",
                          example: "/accounts/login"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        }
      }
    },
    // --------------------------------------------------
  }
};

export default documentation;
