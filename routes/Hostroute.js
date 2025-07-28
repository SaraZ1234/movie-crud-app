//Core Module'
const path = require('path');

const express = require('express');

const hostRouter = express.Router();

//Local Module
const rootDir = require('../utils/pathUtil');

const Controllers = require('../controllers/host-controller');

hostRouter.get('/', Controllers.hostfirstpage);
hostRouter.get('/add_movie', Controllers.addhome);

// hostRouter.get('/search', Controllers.Directed);

hostRouter.post('/add-movie', Controllers.postAddhome);

hostRouter.post('/update-movie', Controllers.postUpdateMovie);


hostRouter.get('/:homeId', Controllers.getHomeDetails);




// hostRouter.get('/:updateId', Controllers.updateData);

module.exports = hostRouter;