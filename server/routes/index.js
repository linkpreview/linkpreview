const path = require('path');
const routesV1 = require('./v1');
//const routesV2 = require('./v2');
const appRoutes = require(path.resolve('./modules/application/routes'));
const config = require(path.resolve('./server/config'));


module.exports = (app) => {

  // mount all v1 routes on /api path
  app.use('/api/v1', routesV1);

  app.use('/', appRoutes);

  //app.use('/api/v2', routesV2);
};
