'use strict';

import { combineReducers } from 'redux';

//import user from 'reducers/user';
import app from 'reducers/app';

//reducers related to admin
import scrape from './scrape';

import { routerReducer as routing } from 'react-router-redux';

const reducer = combineReducers({
  app,
  //user,
  routing,
  scrape,
});

export default reducer;
