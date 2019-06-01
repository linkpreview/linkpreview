import { generateDummyData } from 'utils';
import baseState from 'store/initial-state.js';

const state = {
  app:baseState.app,
  scrape: {
    scrape: null,
    isFetching: false,
    message: '',
    error: ''
  }
};

export default state;
