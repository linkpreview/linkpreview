'use strict';

const should = require('should'),
  request = require('supertest'),
  path = require('path'),
  express = require(path.resolve('server/express')),
  fs = require('fs'),
  _ = require('lodash'),
  helpers = require(path.resolve('modules/application/tests/helpers')),
  config = require(path.resolve('./server/config'));

describe('App Integration', function () {

  let app, agent;

  before(function(){

    this.timeout(10000);
    app = express.initApp();
    agent = request.agent(app);
    return Promise.resolve({});
  });

  beforeEach(()=> {

  });

  it('should render index page', () => {
    const req = agent.get(`/`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');

      helpers.matchRegExp('<meta property="og:title" content="Link Preview">',
        res.text).should.be.true;

      return helpers.matchRegExp(`<link rel="shortcut icon" />`,
        res.text).should.be.true;
    });
  });

  it('should meta tags', () => {
    const req = agent.get(`/`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');
      return helpers.matchRegExp(`<meta property=og:url content=${config.app.site}>`,
        res.text).should.be.true;
    });
  });

  describe('Embed Integration', function(){
    it('should embed page', () => {
      const req = agent.get(`/embed`)
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        return res.type.should.equal('text/html');
      });
    });

  });

  afterEach(() => {
    return Promise.resolve({});
  });

  after(() => {
    return Promise.all([]);
  });

});
