const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {};
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle snippet submit
fastify.post("/", function (req, res) {
 
  var regex = /embedded_svc.init\(([^\)]+.*)\);/;
 
  var settings = req.body.snippet.match(regex);
  
  regex = /(00D)(.{12})/g;
  var orgid = settings[1].match(regex);
  
  regex = /(573)(.{12})/g;
  var buttonId = settings[1].match(regex);
  regex = /(572)(.{12})/g;
  var deploymentId = settings[1].match(regex);
  regex = /baseLiveAgentURL: ('(.*)')/;
  var endpoint = settings[1].match(regex);
 
  var endpointUrl = endpoint[2] + "/rest/";
  

  let params = {
    orgid: orgid[0],
    endpointUrl: endpointUrl,
    buttonId: buttonId[0],
    deploymentId: deploymentId[0],
  };
  
  res.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT || 3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
