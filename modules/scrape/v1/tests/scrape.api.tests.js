'use strict';

const should = require('should'),
  request = require('supertest'),
  path = require('path'),
  express = require(path.resolve('./server/express')),
  fs = require('fs'),
  _ = require('lodash'),
  helpers = require(path.resolve('modules/application/tests/helpers')),
  config = require(path.resolve('./server/config'));

const SCRAPE_URL = 'https://namchey.com/itineraries/tilicho';
const TITLE = 'Tilicho Lake (Off-Season) - Dipesh Acharya';


describe('Scrape API v1 Tests', function () {

  let app, agent;

  before(function(){

    this.timeout(10000);
    app = express.initApp();
    agent = request.agent(app);
    return Promise.resolve({});
  });

  beforeEach(()=> {

  });

  it('should return opengraph/twittercard/oembed information', function() {
    this.timeout(10000);
    const req = agent.get(`/api/v1/scrape?url=${SCRAPE_URL}`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      const result = res.body.json;
      result.twittercard['twitter:title'].should.equal(TITLE);
      result.opengraph['og:title'].should.equal(TITLE);
      return result.oembed.formats.should.match(['xml', 'json']);
    });

  });

  afterEach(() => {
    return Promise.resolve({});
  });

  after(() => {
    return Promise.all([]);
  });

});
