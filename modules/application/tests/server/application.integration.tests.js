'use strict';

const should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongooseConfig = require(path.resolve('server/mongoose')),
  fs = require('fs'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category'),
  NewsFeed = mongoose.model('NewsFeed'),
  UserActivity = mongoose.model('UserActivity'),
  ViewCount = mongoose.model('ViewCount'),
  Place = mongoose.model('Place'),
  Itinerary = mongoose.model('Itinerary'),
  Page = mongoose.model('Page'),
  Activity = mongoose.model('Activity'),
  Plan = mongoose.model('Plan'),
  PagePlan = mongoose.model('PagePlan'),
  CategoryCount = mongoose.model('CategoryCount'),
  Promise = require('promise'),
  helpers = require(path.resolve('modules/application/tests/server/helpers')),
  express = require(path.resolve('./server/express')),
  testData = require(path.resolve('./data/tests/users.json')),
  config = require(path.resolve('./server/config')),
  appConstants = require(path.resolve('./modules/application/server/constants/index')),
  testPlaceData = require(path.resolve('data/tests/places.json')),
  testPlansData = require(path.resolve('data/tests/business-plans.json')),
  testPageData = require(path.resolve('data/tests/pages.json'));


describe('App Integration', function () {

  let app, agent, user, user2, user3, userCredentials, userCredentials2, userCredentials3, place, activity, itinerary, category, categoryPage, page;

  const signIn = (credentials) => {
    return helpers.signIn(agent, credentials);
  };

  const signOut = (credentials) => {
    return helpers.logOut(agent, credentials);
  };

  before(function(){

    this.timeout(10000);
    app = express.initUserApp(mongooseConfig);
    agent = request.agent(app);
    user = new User({...testData.user, username: 'user1_int', email: 'user_int@test.com'});
    user2 = new User({...testData.user, username: 'user_app_int', email: 'user_app_int@test.com', roles: ['user', 'admin']});
    user3 = new User({...testData.user, username: 'user3_int', email: 'user3_int@test.com'});
    userCredentials = user.toObject();
    userCredentials2 = user2.toObject();
    userCredentials3 = user3.toObject();
    page = new Page(testPageData.page);
    page.createdBy = user._id;
    page.updatedBy = user._id;
    page.managers = [user._id];
    place = new Place(testPlaceData.place);
    place.createdBy = user._id;

    category = new Category({
      name: 'Packages',
      slug: 'packages',
      page: page._id,
      createdBy: user,
      updatedBy: user
    });

    categoryPage = new Category({
      name: 'About Us',
      slug: 'about-test',
      isPage: true,
      page: page._id,
      createdBy: user,
      updatedBy: user
    });

    activity = new Activity({
      name: 'Bungee',
      slug: 'bungee',
      user,
      createdBy: user,
      updatedBy: user
    });

    itinerary = new Itinerary({
      name: 'Tilicho Trek',
      slug: 'tilicho-trek',
      description: "Annapurna Circuit",
      duration: 5,
      details: [{startPlace: place, endPlace: place}],
      createdBy: user,
      updatedBy: user
    });


    const promises = [];
    const businessPlans = Object.keys(testPlansData).map((plan) => {
      const planDoc =  new Plan(testPlansData[plan]);
      planDoc.createdBy = user._id;
      planDoc.updatedBy = user._id;
      promises.push(planDoc.save());
      return planDoc;
    });

    //subdomain plan for a page
    const pagePlan = new PagePlan({page: page._id, plan: businessPlans[0]._id});
    return Promise.all([User.remove({}), Place.remove({}), Itinerary.remove({}), Category.remove({}),
      Page.remove({}), CategoryCount.remove({}), NewsFeed.remove({}), Activity.remove({}),
      UserActivity.remove({}), ViewCount.remove({}), Plan.remove({}), PagePlan.remove({})]).then(()=> {
      return Promise.all([user.save(), user2.save(), user3.save(),
        category.save(), categoryPage.save(), page.save(),
        place.save(), itinerary.save(), activity.save(), ...promises, pagePlan]);
    });
  });

  beforeEach(()=> {

  });

  it('should render index page', () => {
    const req = agent.get(`/`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');

      helpers.matchRegExp('<meta property="og:title" content="Namchey | Travel. Explore. Share">',
        res.text).should.be.true;

      return helpers.matchRegExp(`<link rel="shortcut icon" />`,
        res.text).should.be.true;
    });
  });

  it('should render home page for authenticated user', () => {
    return signIn(userCredentials)
      .then((res)=> {
        const req = agent.get('/')
          .expect(200);
        return helpers.endRequest(req);
      }).then(function(res){
          res.type.should.equal('text/html');

          helpers.matchRegExp('<meta property="og:title" content="Namchey | Travel. Explore. Share">',
            res.text).should.be.true;
          return helpers.matchRegExp(`<h3>News Feed</h3>`,
            res.text).should.be.true;
      })
  });

  it('should render itinerary meta headers', () => {
    const req = agent.get(`/itineraries/${itinerary.slug}`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');

      helpers.matchRegExp('<meta property="og:description" content="Annapurna Circuit.">',
        res.text).should.be.true;

      return helpers.matchRegExp(`<meta property=og:url content=${config.app.site}/itineraries/tilicho-trek>`,
        res.text).should.be.true;
    });
  });

  it('should render place meta headers', () => {
    const req = agent.get(`/places/${place.slug}`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');
      return helpers.matchRegExp(`<meta property=og:url content=${config.app.site}/places/lalitpur>`,
        res.text).should.be.true;
    });
  });

  it('should render user meta headers', () => {
    const req = agent.get(`/users/${user.username}`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');
      return helpers.matchRegExp(`<meta property=og:url content=${config.app.site}/users/testuser>`,
        res.text).should.be.true;
    });
  });

  it('should render activity meta headers', () => {
    const req = agent.get(`/activities/${activity.slug}`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');
      return helpers.matchRegExp(`<meta property=og:url content=${config.app.site}/activities/bungee>`,
        res.text).should.be.true;
    });
  });

  describe('Embed Integration', function(){
    it('should render itinerary embed page', () => {
      const req = agent.get(`/embeds/itineraries/${itinerary.slug}`)
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        res.type.should.equal('text/html');

        helpers.matchRegExp('<meta property="og:description" content="Annapurna Circuit.">',
          res.text).should.be.true;

        return helpers.matchRegExp(`<meta property=og:url content=${config.app.site}/itineraries/tilicho-trek>`,
          res.text).should.be.true;
      });
    });

  });

  describe('Page Integration', function(){
    it('should render category-page meta headers', () => {
      const req = agent.get(`/about-us`)
        .set('namchey-subdomain', 'taa')
        .set('namchey-domain', 'taa.com')
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        res.type.should.equal('text/html');
        return helpers.matchRegExp(`<meta property=og:url content=https://taa.com/about-us>`,
          res.text).should.be.true;
      });
    });

    it('should render category meta headers', () => {
      const req = agent.get(`/packages`)
        .set('namchey-subdomain', 'taa')
        .set('namchey-domain', 'taa.com')
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        res.type.should.equal('text/html');
        return helpers.matchRegExp(`<meta property=og:url content=https://taa.com/packages>`,
          res.text).should.be.true;
      });
    });
  });

  afterEach(() => {
    return Promise.all([CategoryCount.remove({}),
      NewsFeed.remove({}), UserActivity.remove({})]);
  });

  after(() => {
    return Promise.all([User.remove({}), Plan.remove({}), PagePlan.remove({})]);
  });

});
