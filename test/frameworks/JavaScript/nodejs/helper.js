const Handlebars = require('handlebars');

const GREETING = "Hello, World!";

const self = module.exports = {

  additionalFortune: () => ({
    id: 0,
    message: 'Additional fortune added at request time.'
  }),

  fortunesTemplate: Handlebars.compile([
    "<!DOCTYPE html>",
    "<html>",
    "<head><title>Fortunes</title></head>",
    "<body>",
    "<table>",
      "<tr>",
        "<th>id</th>",
        "<th>message</th>",
      "</tr>",
      "{{#fortunes}}",
      "<tr>",
        "<td>{{id}}</td>",
        "<td>{{message}}</td>",
      "</tr>",
      "{{/fortunes}}",
    "</table>",
    "</body>",
    "</html>"
  ].join('')),

  randomBwNumber: () => Math.floor(Math.random() * 10000) + 1,

  fillArray: (value, len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  },

  addBwHeaders: (res, headerType) => {
    const headerTypes = {
      plain: 'text/plain',
      json:  'application/json',
      html:  'text/html; charset=UTF-8'
    };
    
    res.setHeader('Server', 'Node');
    res.setHeader('Content-Type', headerTypes[headerType]);
},

  responses: {

    jsonSerialization: (req, res) => {
      const HELLO_OBJ = { message: GREETING };
      self.addBwHeaders(res, 'json');
      res.end(JSON.stringify(HELLO_OBJ));
    },

    plaintext: (req, res) => {
      self.addBwHeaders(res, 'plain');
      res.end(GREETING);
    },

    routeNotImplemented: (req, res) => {
      res.writeHead(501, {'Content-Type': 'text/plain; charset=UTF-8'});
      const reason = { reason: "`" + req.url + "` is not an implemented route" };
      res.end(JSON.stringify(reason));
    }

  }

};
