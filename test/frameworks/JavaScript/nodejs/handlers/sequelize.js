const h = require('../helper');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('hello_world', 'benchmarkdbuser', 'benchmarkdbpass', {
  host: 'bw-database',
  dialect: 'mysql',
  logging: false
});

const Worlds = sequelize.define('World', {
  id: {
    type: 'Sequelize.INTEGER',
    primaryKey: true
  },
  randomNumber: { type: 'Sequelize.INTEGER' }
}, {
    timestamps: false,
    freezeTableName: true
  });

const Fortunes = sequelize.define('Fortune', {
  id: {
    type: 'Sequelize.INTEGER',
    primaryKey: true
  },
  message: { type: 'Sequelize.STRING' }
}, {
    timestamps: false,
    freezeTableName: true
  });

const randomWorldPromise = () => {
  return Worlds.findOne({
    where: { id: h.randomBwNumber() }
  }).then((results) => {
    return results;
  }).catch((err) => {
    process.exit(1);
  });
};

module.exports = {

  SingleQuery: (req, res) => {
    randomWorldPromise().then((world) => {
      h.addBwHeaders(res, 'json');
      res.end(JSON.stringify(world));
    });
  },

  MultipleQueries: (queries, req, res) => {
    const worldPromises = [];

    for (let i = 0; i < queries; i++) {
      worldPromises.push(randomWorldPromise());
    }

    Promise.all(worldPromises).then((worlds) => {
      h.addBwHeaders(res, 'json');
      res.end(JSON.stringify(worlds));
    });
  },

  Fortunes: (req, res) => {
    Fortunes.findAll().then((fortunes) => {
      fortunes.push(h.additionalFortune());
      fortunes.sort((a, b) => {
        return a.message.localeCompare(b.message);
      });

      h.addBwHeaders(res, 'html');
      res.end(h.fortunesTemplate({
        fortunes: fortunes
      }));
    }).catch((err) => {
      console.log(err.stack);
      process.exit(1);
    });
  },

  Updates: (queries, req, res) => {
    const worldPromises = [];

    for (let i = 0; i < queries; i++) {
      worldPromises.push(randomWorldPromise());
    }

    const worldUpdate = (world) => {
      world.randomNumber = h.randomBwNumber();

      return Worlds.update({
        randomNumber: world.randomNumber
      },
        {
          where: { id: world.id }
        }).then((results) => {
          return world;
        }).catch((err) => {
          process.exit(1);
        });
    };

    Promise.all(worldPromises).then((worlds) => {
      const updates = worlds.map((e) => worldUpdate(e));

      Promise.all(updates).then((updated) => {
        h.addBwHeaders(res, 'json');
        res.end(JSON.stringify(updated));
      });
    });
  }

};
