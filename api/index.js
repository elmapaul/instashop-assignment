const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));
const cors = require('cors');
const Parse = require('parse/node');
const bodyParser = require('body-parser')
require('dotenv').config();

const databaseUri = process.env.DATABASE_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

// https://parseplatform.org/parse-server/api/5.0.0/ParseServerOptions.html
const config = {
  fileUpload: {
    enableForAuthenticatedUser: true,
    enableForPublic: true
  },
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', 
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', 
  liveQuery: {
    classNames: ['Landmarks'], 
  }
};

const app = express();

// Parse init
Parse.initialize(process.env.APP_ID, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;

// enabling CORS for any unknown origin
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';

if (!test) {
  const api = new ParseServer(config);
  app.use(mountPath, api);

  // Update landmark object
  app.put('/landmarks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, short_info, description } = req.body;
  
    let landmark;
    const Landmark = Parse.Object.extend("Landmark");
    const query = new Parse.Query(Landmark);
    await query.get(id);
    landmark = await query.first();
  
    try {
      landmark.set("title", title);
      landmark.set("description", description);
      landmark.set("short_info", short_info);
      landmark.set("url", url);
      await landmark.save();
    } catch(error) {
      console.log(error);
    }
  
    res.status(200).send(landmark);
  });

  app.get('/landmarks/search', async (req, res) => {
    const { text } = req.query;
    
    let landmarks;
    const Landmark = Parse.Object.extend("Landmark");
    const query = new Parse.Query(Landmark);
    query.matches('title', new RegExp(text, 'i'));
    landmarks = await query.find();
  
    res.status(200).send(landmarks);
  });
}

const port = process.env.SERVER_PORT || 1337;

if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('Running on port ' + port + '.');
  });
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
