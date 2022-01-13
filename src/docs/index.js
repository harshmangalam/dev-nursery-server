const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "DEV Nursery",
      version: "1.0.0",
      description:
        "This is a simple Plants Nursery API application made with Express, Mongodb and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Harsh Mangalam",
        url: "https://dev.to/harshmangalam",
        email: "harshdev8218@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:4000/`,
      },
    ],
  },
  apis: ["../routes/*.js"],
};

module.exports = swaggerJsdoc(options);
