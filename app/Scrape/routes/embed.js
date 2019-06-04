'use strict';
import React  from 'react';
import EmbedSite from 'Scrape/EmbedSite';

export default (store, options) => {
  return {
    path: '/embed',
    component: EmbedSite
  }
}
