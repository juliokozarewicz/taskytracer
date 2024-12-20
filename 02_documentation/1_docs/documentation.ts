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
        tags: ["TASKS"],
        security: [
          {
            BearerAuth: []
          }
        ],
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
        tags: ["TASKS"],
        security: [
          {
            BearerAuth: []
          }
        ],
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
        tags: ["TASKS"],
        security: [
          {
            BearerAuth: []
          }
        ],
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
        tags: ["TASKS"],
        security: [
          {
            BearerAuth: []
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
        tags: ["TASKS"],
        security: [
          {
            BearerAuth: []
          }
        ],
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
      put: {
        summary: "Update an existing task",
        description: "Updates the details of an existing task specified by its ID.",
        tags: ["TASKS"],
        security: [
          {
            BearerAuth: []
          }
        ],
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
        tags: ["TASKS"],
        security: [
          {
            BearerAuth: []
          }
        ],
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
    "/accounts/activate-email": {
      post: {
        summary: "Activate email",
        description: "Activates a user's email address using a provided code.",
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
                  code: {
                    type: "string",
                    example: "123456"
                  }
                },
                required: ["email", "code"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Email activated successfully.",
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
                      example: "Your email has been successfully activated."
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/activate-email"
                        },
                        next: {
                          type: "string",
                          example: "/accounts/login"
                        },
                        prev: {
                          type: "string",
                          example: "/accounts/activate-email-link"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      }
    },
    // --------------------------------------------------
    "/accounts/change-password-link": {
      post: {
        summary: "Request a password change link",
        description: "Sends a password change link to the user's email address. Requires a valid email and a link.",
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
                    example: "user@example.com",
                    description: "The email address of the user requesting the password change."
                  },
                  link: {
                    type: "string",
                    example: "https://example.com/reset-password",
                    description: "The URL link where the user can reset their password."
                  }
                },
                required: ["email", "link"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Password change link sent successfully.",
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
                      example: "Change your password by clicking the link sent to your email."
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/change-password-link"
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
    "/accounts/change-password": {
      patch: {
        summary: "Change user password",
        description: "Allows a user to change their password using a valid email, a password, and a verification code.",
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
                    example: "user@example.com",
                    description: "The email address of the user changing their password."
                  },
                  password: {
                    type: "string",
                    example: "P@ssw0rd123",
                    description: "The new password for the user. Must be at least 8 characters long and contain uppercase letters, digits, and special characters."
                  },
                  code: {
                    type: "string",
                    example: "123456",
                    description: "The verification code sent to the user's email for changing the password."
                  }
                },
                required: ["email", "password", "code"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Password changed successfully.",
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
                      example: "Password changed successfully. Please log in to continue."
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/accounts/change-password"
                        },
                        next: {
                          type: "string",
                          example: "/accounts/login"
                        },
                        prev: {
                          type: "string",
                          example: "/accounts/change-password-link"
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
    "/accounts/login": {
      post: {
        summary: "User login",
        description: "Allows a user to log in using their email and password. If successful, returns JWT and refresh tokens.",
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
                    example: "user@example.com",
                    description: "The email address of the user logging in."
                  },
                  password: {
                    type: "string",
                    example: "P@ssw0rd123",
                    description: "The password of the user. Must be at least 8 characters long."
                  }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login successful. Returns access and refresh tokens.",
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
                      example: "Login successful."
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          access: {
                            type: "string",
                            example: "encryptedAccessToken"
                          },
                          refresh: {
                            type: "string",
                            example: "encryptedRefreshToken"
                          }
                        }
                      }
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/accounts/login"
                        },
                        next: {
                          type: "string",
                          example: "/dashboard"
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
    "/accounts/refresh-login": {
      post: {
        summary: "Refresh user login",
        description: "Allows a user to obtain new access and refresh tokens using a valid refresh token.",
        tags: ["ACCOUNTS"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  refresh: {
                    type: "string",
                    example: "a1b2c3d4e5f6",
                    description: "The refresh token used to obtain new access and refresh tokens. Must be a valid token."
                  }
                },
                required: ["refresh"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Refresh successful. Returns new access and refresh tokens.",
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
                      example: "Login successful."
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          access: {
                            type: "string",
                            example: "encryptedNewAccessToken"
                          },
                          refresh: {
                            type: "string",
                            example: "encryptedNewRefreshToken"
                          }
                        }
                      }
                    },
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "string",
                          example: "/accounts/refresh-login"
                        },
                        next: {
                          type: "string",
                          example: "/dashboard"
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
    "/accounts/profile": {
      get: {
        summary: "List user profile",
        description: "Fetches the user's profile information based on the authenticated user's ID.",
        tags: ["ACCOUNTS"],
        security: [
          {
            BearerAuth: []
          }
        ],
        responses: {
          "200": {
            description: "Profile data retrieved successfully.",
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
                      example: "Data received successfully."
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          biography: {
                            type: "string",
                            example: "This is a sample biography."
                          },
                          phone: {
                            type: "string",
                            example: "+55 11 91234-5678"
                          },
                          cpf: {
                            type: "string",
                            example: "123.456.789-00"
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
                          example: "/accounts/profile"
                        },
                        next: {
                          type: "string",
                          example: "/accounts/profile-update"
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
          }
        }
      }
    },
  // --------------------------------------------------
  "/accounts/profile-update": {
    put: {
      summary: "Update user profile",
      description: "Updates the authenticated user's profile information, such as biography, phone, and CPF. Only the fields provided in the request body will be updated.",
      tags: ["ACCOUNTS"],
      security: [
        {
          BearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                biography: {
                  type: "string",
                  description: "The user's biography (optional). Maximum length of 500 characters.",
                  example: "This is a new biography."
                },
                phone: {
                  type: "string",
                  description: "The user's phone number (optional). Maximum length of 25 characters.",
                  example: "+55 11 91234-5678"
                },
                cpf: {
                  type: "string",
                  description: "The user's CPF (optional). Must contain 11 digits.",
                  example: "12345678901"
                }
              },
              required: ["email", "id"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Profile updated successfully.",
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
                    example: "Profile updated successfully."
                  },
                  links: {
                    type: "object",
                    properties: {
                      self: {
                        type: "string",
                        example: "/accounts/profile-update"
                      },
                      next: {
                        type: "string",
                        example: "/accounts/profile"
                      },
                      prev: {
                        type: "string",
                        example: "/accounts/profile-update"
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
  "/accounts/update-email-link": {
    post: {
      summary: "Update user email",
      description: "Sends a verification email to the user with a link to confirm their new email address. The user must provide the new email address and a link to complete the update process. The system will generate a unique code, send it via email, and store it in the database for verification. This process ensures that the email update is secure and verified before being committed.",
      tags: ["ACCOUNTS"],
      security: [
        {
          BearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                newemail: {
                  type: "string",
                  description: "The new email address to associate with the user's account.",
                  example: "new-email@example.com"
                },
                link: {
                  type: "string",
                  description: "The link to which the user must navigate to complete the email update process. This link includes the unique verification code for the email change.",
                  example: "https://yourdomain.com/confirm-email-update"
                }
              },
              required: ["newemail", "link"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Email update request successfully sent.",
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
                    example: "Update email sent successfully."
                  },
                  links: {
                    type: "object",
                    properties: {
                      self: {
                        type: "string",
                        example: "/accounts/update-email-link"
                      },
                      next: {
                        type: "string",
                        example: "/accounts/update-email"
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
        }
      }
    }
  },
  // --------------------------------------------------
  "/accounts/update-email": {
    patch: {
      summary: "Update user email",
      description: "Updates the user's email address after verifying the provided code and password. The user must submit the new email address, a verification code, and their password to complete the update. If successful, the user's email is updated in the database, and all related tokens (email verification and refresh tokens) are deleted for security purposes.",
      tags: ["ACCOUNTS"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                newemail: {
                  type: "string",
                  description: "The new email address to associate with the user's account.",
                  example: "new-email@example.com"
                },
                code: {
                  type: "string",
                  description: "The verification code sent to the user's old email address for confirming the email update.",
                  example: "123456_update-email"
                },
                password: {
                  type: "string",
                  description: "The user's current password, required for authentication.",
                  example: "SecureP@ssw0rd!"
                }
              },
              required: ["newemail", "code", "password"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "User email successfully updated.",
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
                    example: "Email updated successfully."
                  },
                  links: {
                    type: "object",
                    properties: {
                      self: {
                        type: "string",
                        example: "/accounts/update-email"
                      },
                      next: {
                        type: "string",
                        example: "/accounts/login"
                      },
                      prev: {
                        type: "string",
                        example: "/accounts/update-email-link"
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
  "/accounts/delete-account-link": {
    post: {
      summary: "Send delete account link",
      description: "Sends an email with a secure link to delete the user's account. The link contains a unique code that allows the user to confirm the account deletion. The user must be logged in and provide a link to be included in the email for account deletion confirmation.",
      tags: ["ACCOUNTS"],
      security: [
        {
          BearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                link: {
                  type: "string",
                  description: "The URL where the user can confirm the account deletion. Must be a valid URL.",
                  example: "https://example.com/delete-account"
                }
              },
              required: ["link"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Delete account link sent successfully.",
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
                    example: "Account deletion link sent successfully."
                  },
                  links: {
                    type: "object",
                    properties: {
                      self: {
                        type: "string",
                        example: "/accounts/delete-account-link"
                      },
                      next: {
                        type: "string",
                        example: "/accounts/delete-account"
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
        }
      }
    }
  },
  // --------------------------------------------------
  "/accounts/delete-account": {
    delete: {
      summary: "Delete user account",
      description: "The user account is deleted after validating the email, password, and token. Once the account is deleted, the associated refresh tokens and email verification codes will also be removed, and the account will be deactivated.",
      tags: ["ACCOUNTS"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "The verification code sent to the user. This code is required to confirm the account deletion.",
                  example: "abc123"
                },
                email: {
                  type: "string",
                  description: "The email address of the user. It is required to validate the account before deletion.",
                  example: "emailexample@email.com"
                },
                password: {
                  type: "string",
                  description: "The user's password. It must meet specific security requirements, including length and complexity.",
                  example: "Password123!"
                }
              },
              required: ["code", "email", "password"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Account successfully deleted.",
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
                    example: "Account deletion commit successful."
                  },
                  links: {
                    type: "object",
                    properties: {
                      self: {
                        type: "string",
                        example: "/accounts/delete-account"
                      },
                      next: {
                        type: "string",
                        example: "/accounts/login"
                      },
                      prev: {
                        type: "string",
                        example: "/accounts/delete-account-link"
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
  }
};

export default documentation;
