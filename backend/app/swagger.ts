import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventFlow API",
      version: "1.0.0",
      description: "A comprehensive event management system API",
      contact: {
        name: "EventFlow Team",
        email: "support@eventflow.com"
      }
    },
    servers: [
      {
        url: "http://localhost:5174",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        // User Schemas
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            phone: { type: "string", example: "+1234567890" },
            role: { 
              type: "string", 
              enum: ["USER", "ORGANIZER", "ADMIN"],
              example: "USER"
            },
            status: { 
              type: "string", 
              enum: ["Active", "Inactive"],
              example: "Active"
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        SignupUser: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", minLength: 6, example: "password123" },
            phone: { type: "string", example: "+1234567890" },
            role: { 
              type: "string", 
              enum: ["USER", "ORGANIZER", "ADMIN"],
              default: "USER",
              example: "USER"
            },
            receiveUpdates: { type: "boolean", default: false }
          }
        },
        SigninUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "password123" }
          }
        },
        AuthenticatedUser: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                phone: { type: "string", example: "+1234567890" },
                role: { type: "string", example: "USER" },
                status: { type: "string", example: "Active" },
                createdAt: { type: "string", format: "date-time" }
              }
            },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
          }
        },
        UserUpdateInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            phone: { type: "string", example: "+1234567890" }
          }
        },
        
        // Event Schemas
        Event: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            organizer_id: { 
              type: "object",
              properties: {
                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                name: { type: "string", example: "Event Organizer" }
              }
            },
            title: { type: "string", example: "Tech Conference 2024" },
            description: { type: "string", example: "Annual technology conference" },
            imageUrl: { type: "string", example: "https://example.com/image.jpg" },
            category: { type: "string", example: "Technology" },
            date: { type: "string", format: "date-time", example: "2024-12-25T10:00:00Z" },
            location: { type: "string", example: "San Francisco, CA" },
            capacity: { type: "number", example: 500 },
            costs: { type: "string", example: "$50" },
            status: { 
              type: "string", 
              enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
              example: "APPROVED"
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        CreateEventInput: {
          type: "object",
          required: ["title", "description", "category", "date", "location", "capacity", "costs"],
          properties: {
            title: { type: "string", example: "Tech Conference 2024" },
            description: { type: "string", example: "Annual technology conference" },
            imageUrl: { type: "string", example: "https://example.com/image.jpg" },
            category: { type: "string", example: "Technology" },
            date: { type: "string", format: "date-time", example: "2024-12-25T10:00:00Z" },
            location: { type: "string", example: "San Francisco, CA" },
            capacity: { type: "number", example: 500 },
            costs: { type: "string", example: "$50" }
          }
        },
        UpdateEventInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "Tech Conference 2024" },
            description: { type: "string", example: "Annual technology conference" },
            imageUrl: { type: "string", example: "https://example.com/image.jpg" },
            category: { type: "string", example: "Technology" },
            date: { type: "string", format: "date-time", example: "2024-12-25T10:00:00Z" },
            location: { type: "string", example: "San Francisco, CA" },
            capacity: { type: "number", example: 500 },
            costs: { type: "string", example: "$50" }
          }
        },
        UpdateEventStatus: {
          type: "object",
          properties: {
            status: { 
              type: "string", 
              enum: ["PENDING", "CANCELLED"],
              example: "CANCELLED"
            }
          }
        },
        AdminUpdateEventStatus: {
          type: "object",
          properties: {
            status: { 
              type: "string", 
              enum: ["APPROVED", "REJECTED"],
              example: "APPROVED"
            }
          }
        },
        
        // Booking Schemas
        Booking: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            eventId: { type: "string", example: "507f1f77bcf86cd799439011" },
            userId: { type: "string", example: "507f1f77bcf86cd799439011" },
            userName: { type: "string", example: "John Doe" },
            eventTitle: { type: "string", example: "Tech Conference 2024" },
            status: { 
              type: "string", 
              enum: ["BOOKED", "INACTIVE", "CANCELLED", "WAITLISTED"],
              example: "BOOKED"
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        
        // Error Schemas
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error message" },
            status: { type: "number", example: 400 }
          }
        },
        ValidationError: {
          type: "object",
          properties: {
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "Email is required" }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    "./app/features/**/*.ts",
    "./app/index.ts",
    "./app/features/auth/controllers/*.ts",
    "./app/features/users/controllers/*.ts",
    "./app/features/events/*.ts",
    "./app/features/bookings/*.ts"
  ]
};

console.log("🔍 Swagger configuration loaded with APIs:", options.apis);

const swaggerSpec = swaggerJSDoc(options);

console.log("📚 Swagger spec generated successfully");

export default swaggerSpec;