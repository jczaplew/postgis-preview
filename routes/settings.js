const fs = require('fs');
const express = require('express');
const router = express.Router();

async function testConnection(options) {
  var options = {
    error: (error, e) => {
      if (e.cn) {
        // A connection-related error;
        console.log("CN:", e.cn);
        console.log("EVENT:", error.message);
      }
    }
  }

  var pgp = require('pg-promise')(options);
  var db = pgp(`postgres://${options.username}:${options.password}@${options.host}:${options.port}/${options.database}`);

  db.connect()
    .then(obj => {
      obj.done(); // success, release connection;
      return
    })
    .catch(error => {
      return error
    });
}


// Get all connections
router.get('/connections', (req, res, next) => {
  fs.readFile(`${__dirname}/connections.json`, (error, data) => {
    if (error) {
      // return error
    }
    res.json(JSON.parse(data));
  });
});

// Create a new connection
router.post('/connection', async (req, res, next) => {
  console.log(req.body)
  // Validate incoming parameters. Client should take care of default values...?
  if (!req.body.database) {
    return res.status(400).json({ 'error': 'A database is required' });
  }
  if (!req.body.host) {
    return res.status(400).json({ 'error': 'A host is required' });
  }
  if (!req.body.port) {
    return res.status(400).json({ 'error': 'A port is required' });
  }
  if (!req.body.username) {
    return res.status(400).json({ 'error': 'A username is required' });
  }
  // Don't require a password
  req.body.password = req.body.password || '';

  // Create a display name if none is provided
  req.body.nickname = req.body.nickname || `${req.body.username}@${req.body.host}/${req.body.database}`;

  // First check if that connection exists
  fs.readFile(`${__dirname}/connections.json`, async (error, data) => {
    if (error) {
      return res.status(500).json({ 'error': 'Could not read connections' })
    }
    let connections = JSON.parse(data)
    connections.forEach(connection => {
      if (
        connection.database === req.body.database &&
        connection.host === req.body.host &&
        connection.port === req.body.port &&
        connection.username === req.body.username &&
        connection.password === req.body.password
      ) {
        return res.status(400).json({ 'error': 'This connection already exists' });
      }
      if (connections.nickname === req.body.nickname) {
        return res.status(400).json({ 'error': 'A connection with this name already exists' });
      }
    });

    // Test the new connection
    let connectionError = await testConnection(req.body);
    if (connectionError) {
      return res.status(400).json({ 'error': 'Connection unsuccessful', 'details': connectionError });
    }

    // Ok, we're convinced it is good. Save it.
    connections.push({
      'database': req.body.database,
      'host': req.body.host,
      'port': req.body.port,
      'username': req.body.username,
      'password': req.body.password,
      'nickname': req.body.nickname
    });

    fs.writeFileSync(`${__dirname}/connections.json`, JSON.stringify(connections));


    res.status(200).json({ 'success': 'Connection successfully saved' });
  });
});

// Update an existing connection
router.put('/connection', (req, res, next) => {

});

module.exports = router;
