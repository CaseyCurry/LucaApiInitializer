"use strict";

const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const serviceRegistry = require("luca-service-registry-library");
const ApiError = require("./api-error");

const initialize = (app, name, registerRoutesCallback) => {
  serviceRegistry.register(name)
    .then(port => {
      initializeWithPort(app, port, registerRoutesCallback);
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports.initialize = initialize;

const initializeWithPort = (app, port, registerRoutesCallback) => {
  app.use(helmet());

  app.use(cors({
    origin: "*"
  }));

  app.use(bodyParser.json());

  // add a "/" route so that the service registry can poll the service
  serviceRegistry.addStatusRoute(app);

  registerRoutesCallback(app);

  // eslint-disable-next-line no-unused-vars
  app.use((error, request, response, next) => {
    response
      .status(500)
      .send(new ApiError(error));
    response.end();
  });

  app.listen(port, () => {
    console.log(`listening on port ${port}...`);
  });
};

module.exports.initializeWithPort = initializeWithPort;
