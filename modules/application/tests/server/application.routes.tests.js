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


describe('App CRUD tests', function () {
  let app, agent, user, user2, user3, userCredentials, userCredentials2, userCredentials3, place, itinerary, category, categoryPage, page;

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
    user = new User({...testData.user, username: 'user1', email: 'user1@test.com'});
    user2 = new User({...testData.user, username: 'user_app', email: 'user_app@test.com', roles: ['user', 'admin']});
    user3 = new User({...testData.user, username: 'user3_app', email: 'user3_app@test.com'});
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
      Page.remove({}), CategoryCount.remove({}), NewsFeed.remove({}),
      UserActivity.remove({}), ViewCount.remove({}), Plan.remove({}), PagePlan.remove({})]).then(()=> {
      return Promise.all([user.save(), user2.save(), user3.save(), category.save(), categoryPage.save(), page.save(), place.save(), itinerary.save(),...promises, pagePlan]);
    });
  });

  beforeEach(()=> {

  });

  it('should return results for currencies', () => {
    const req = agent.get(`/api/currencies`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.body[0].code.should.be.exactly('USD');
      return res.body[0].name.should.be.exactly('US Dollar');
    });
  });


  it('should return results for countries', () => {
    const req = agent.get(`/api/countries`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.body.AF.should.be.exactly('Afghanistan');
      return res.body.ZW.should.be.exactly('Zimbabwe');
    });
  });

  it('should post feedback', () => {
    const req = agent.post(`/api/feedbacks`)
      .send({email: 'hacker@gmail.com', body: 'Awesome site'})
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      return res.body.message.should.be.exactly('feedback.posted');
    });
  });

  it('should not post feedback if email is absent', () => {
    const req = agent.post(`/api/feedbacks`)
      .send({body: 'Awesome site'})
      .expect(400);

    return helpers.endRequest(req).then(function (res) {
      return res.body.code.should.be.exactly('feedback.email.required');
    });
  });

  it('should not post feedback if body is absent', () => {
    const req = agent.post(`/api/feedbacks`)
      .send({email: 'hacker@gmail.com'})
      .expect(400);

    return helpers.endRequest(req).then(function (res) {
      return res.body.code.should.be.exactly('feedback.body.required');
    });
  });

  it('should post postCspReportViolation if body is absent', () => {
    const req = agent.post(`/csp-report-violation`)
      .send({message: 'hacked'})
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      return res.body.code.should.be.exactly('csp.reported');
    });
  });

  it('should get oembed data for json type', () => {
      const req = agent.get(`/api/oembed`)
        .query({url: '/itineraries/tilicho-trek'})
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        return res.body.title.should.be.exactly('Tilicho Trek');
      });
  });

  it('should get oembed data for xml type', () => {
      const req = agent.get(`/api/oembed`)
        .query({format: 'xml', url: `/itineraries/${itinerary.slug}`})
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        res.type.should.be.exactly('text/xml');
        return res.text.should.be.exactly(`<?xml version="1.0" encoding="utf-8" standalone="yes"?><oembed><type>rich</type><version>1.0</version><title>Tilicho Trek</title><provider_name>Namchey</provider_name><provider_url>${config.app.site}</provider_url><height>255</height><width>800</width><html>&lt;iframe height="255" width="800" src="${config.app.site}/embeds/itineraries/tilicho-trek" frameborder="0" allowfullscreen&gt;&lt;/iframe&gt;</html><author_name>Testuser</author_name><author_url>${config.app.site}/users/user1</author_url></oembed>`);
      });
  });

  it('should show error for oembed when getting without url: json', () => {
    const req = agent.get(`/api/oembed`)
      .query({})
      .expect(400);

    return helpers.endRequest(req).then(function (res) {
      return res.body.message.should.be.exactly('url is required');
    });
  });

  it('should show error for oembed when getting without url: xml', () => {
    const req = agent.get(`/api/oembed`)
      .query({format: 'xml'})
      .expect(400);

    return helpers.endRequest(req).then(function (res) {
      return res.text.should.be.exactly('<message>url is required</message>');
    });
  });

  it('should show error for oembed when getting invalid url: json', () => {
    const req = agent.get(`/api/oembed`)
      .query({url: '/places'})
      .expect(404);

    return helpers.endRequest(req).then(function (res) {
      return res.body.message.should.be.exactly('No embed resource found for this url');
    });
  });

  it('should get xml for opensearch', () => {
    const req = agent.get(`/opensearch.xml`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      return res.type.should.equal('text/xml');
    });

  });

  it('should render app', () => {
    const req = agent.get(`/`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');
      return helpers.matchRegExp('<meta property="og:description" content="Share your travel experience in visual form that would be easier for others to know how the experience was like.">',
        res.text).should.be.true;
    });
  });

  it('should render embed itinerary', () => {
    const req = agent.get(`/embeds/itineraries/${itinerary.slug}`)
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      res.type.should.equal('text/html');
      helpers.matchRegExp('<meta property="og:description" content="Annapurna Circuit">',
        res.text).should.be.true;
      return helpers.matchRegExp('<meta property=og:url content=https://localhost:4000/itineraries/tilicho-trek>',
        res.text).should.be.true;
    });
  });

  it('should return results for app search', () => {
    const req = agent.get(`/api/whole-search`)
      .query({searchKeyword: 'lalitpur'})
      .expect(200);

    return helpers.endRequest(req).then(function (res) {
      return res.body.places[0]._id.should.be.exactly(String(place._id));
    });
  });

  it('should return results for statistics', () => {
    return signIn(userCredentials2)
      .then((res)=> {
        const req = agent.get(`/api/statistics`)
          .expect(200);
        return helpers.endRequest(req)
      }).then(function (res) {
        return res.body.placesCount.should.equal(1);
      });
  });

  describe('Page', function() {

    it('should render page', () => {
      const req = agent.get(`/taa`)
        .set('namchey-subdomain', 'taa')
        .set('namchey-domain', 'taa.com')
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        res.type.should.equal('text/html');
        console.log(res.body);
        return helpers.matchRegExp('<meta property="og:description" content="We focus on customer satisfaction.">',
          res.text).should.be.true;

      });
    });

    it('should return results for page search', () => {
      const req = agent.get(`/api/${page._id}/whole-search`)
        .query({searchKeyword: 'packages'})
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        return res.body.categories[0]._id.should.be.exactly(String(category._id));
      });
    });

    it('should return results for category-pages search for page', () => {
      const req = agent.get(`/api/${page._id}/whole-search`)
        .query({searchKeyword: 'about'})
        .expect(200);

      return helpers.endRequest(req).then(function (res) {
        return res.body.pages[0]._id.should.be.exactly(String(categoryPage._id));
      });
    });
  });

  describe('Admin', function(){
    it('should render admin', () => {
      return signIn(userCredentials2)
        .then((res)=> {
          const req = agent.get(`/admin`)
            .expect(200);
          return helpers.endRequest(req)
        }).then(function (res) {
          res.type.should.equal('text/html');
          return helpers.matchRegExp('<title>Namchey Admin</title>',
            res.text).should.be.true;
        });
    });

    it('should not render admin for normal users', () => {
      return signIn(userCredentials)
        .then((res)=> {
          const req = agent.get(`/admin`)
            .expect(302);
          return helpers.endRequest(req);
      }).then(function (res) {
        res.type.should.equal('text/plain');
        return helpers.matchRegExp('<title>Namchey Admin</title>',
          res.text).should.be.false;
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
