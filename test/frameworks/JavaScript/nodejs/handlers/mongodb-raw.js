const h = require('../helper');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const collections = {
  World: null,
  Fortune: null
};
MongoClient.connect('mongodb://bw-database/hello_world?maxPoolSize=5', (err, db) => {
  // do nothing if there is err connecting to db

  collections.World = db.collection('world');
  collections.Fortune = db.collection('fortune');
});


const mongodbRandomWorld = (callback) => {
  collections.World.findOne({
    id: h.randomBwNumber()
  }, (err, world) => {
    world._id = undefined; // remove _id from query response
    callback(err, world);
  });
};

const mongodbGetAllFortunes = (callback) => {
  collections.Fortune.find().toArray((err, fortunes) => {
    callback(err, fortunes);
  })
};

const mongodbDriverUpdateQuery = (callback) => {
  collections.World.findOne({ id: h.randomBwNumber() }, (err, world) => {
    world.randomNumber = h.randomBwNumber();
    collections.World.update({ id: world.id }, world, (err, updated) => {
      callback(err, { id: world.id, randomNumber: world.randomNumber });
    });
  });
};


module.exports = {

  SingleQuery: (req, res) => {
    mongodbRandomWorld((err, result) => {
      if (err) { return process.exit(1) }

      h.addBwHeaders(res, 'json');
      res.end(JSON.stringify(result));
    });
  },

  MultipleQueries: (queries, req, res) => {
    const queryFunctions = h.fillArray(mongodbRandomWorld, queries);

    async.parallel(queryFunctions, (err, results) => {
      if (err) { return process.exit(1) }

      h.addBwHeaders(res, 'json');
      res.end(JSON.stringify(results));
    });
  },

  Fortunes: (req, res) => {
    mongodbGetAllFortunes((err, fortunes) => {
      if (err) { return process.exit(1) }

      fortunes.push(h.additionalFortune());
      fortunes.sort(function (a, b) {
        return a.message.localeCompare(b.message);
      });
      h.addBwHeaders(res, 'html');
      res.end(h.fortunesTemplate({
        fortunes: fortunes
      }));
    });
  },

  Updates: (queries, req, res) => {
    const queryFunctions = h.fillArray(mongodbDriverUpdateQuery, queries);

    async.parallel(queryFunctions, (err, results) => {
      if (err) { return process.exit(1) }

      h.addBwHeaders(res, 'json');
      res.end(JSON.stringify(results));
    });
  }

};
