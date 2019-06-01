import * as types from 'Scrape/types';
import deepFreeze from 'deep-freeze';
//import { initialState } from 'Scrape/store';
import initialState from 'Scrape/store/initial-state';
import { errorHandler } from 'reducers/helpers/error';
import { LOCATION_CHANGE } from 'react-router-redux';
import { generateDummyData } from 'utils';

/**
 * Scrape Reducer Function
 * @param state
 * @param action
 * @returns {*}
 */
export default function scrape(state = initialState.scrape, action) {
    //deepFreeze(state);
    switch (action.type) {
        case types.GET_SCRAPE_REQUEST:

            return {...state,
                isFetching: true,
                scrape: generateDummyData(1)[0],
                error: ''
            };

        case types.GET_SCRAPE_SUCCESS:
            return {...state,
                isFetching: false,
                scrape: action.req.data,
                error: ''
            };

        case types.GET_SCRAPE_FAILURE:
            return {...state,
                isFetching: false,
                scrape: null,
                error: errorHandler(action.error),
                message: ''
            };

        case LOCATION_CHANGE:
            return {...state, error: '', message: '', syncMessage: '', syncError: ''};

        case types.SCRAPE_MSG:
            return {...state, syncMessage: action.message, syncError: ''};

        case types.SCRAPE_ERROR:
            return {...state, syncError: action.error, syncMessage: ''};

        default:
            return state;
    }
}
