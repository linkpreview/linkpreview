import { generateDummyData } from 'utils';

const state = {
  app: {
    error: '',
    message: '',
    //for making message component removable. network error, app message
    showNetErrorComponent:false,
    appMessage: '',
    isCodeLoading: false,
    appLoaded: false,
  }
};

export default state;
