const express = require('express');
const { checkHubId, checkHubPayload } = require('./hubs-middleware');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

router.get('/', (req, res, next) => {
  Hubs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id', checkHubId, (req, res) => {
  // it would be nice to already be sure id exists by the time the request reaches HERE
  res.json(req.hub);
});

router.post('/', checkHubPayload, (req, res, next) => {
  Hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      next(error);
    });
});

router.delete('/:id', checkHubId, (req, res, next) => {
  Hubs.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'The hub has been nuked' });
    })
    .catch(error => {
      next(error);
    });
});

router.put('/:id', checkHubId, checkHubPayload, (req, res, next) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      res.status(200).json(hub);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id/messages', checkHubId, (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id/messages', checkHubId, (req, res, next) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      // next() without args, means: 'hey req/res, proceed to next middleware
      next(error); // next(err) with arg, means: 'go find the closest error handling middleware AFTER this'
    });
});

// eslint-disable-next-line
router.use((err, req, res, next) => { // put this AFTER the endpoints
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: 'Something bad inside the hubs router!'
  });
});

module.exports = router;
