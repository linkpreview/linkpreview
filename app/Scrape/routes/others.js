'use strict';
import { codeLoading, codeLoaded, codeLoadError } from 'actions/app';
import NotFound from 'Scrape/NotFound';

export default (store, options) => {
    return {
        childRoutes: [
            {
                path: '*',
                component: NotFound
            }
        ]
    }
}
