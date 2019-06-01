'use strict';

/**
 * Module dependencies.
 */
const path = require('path'),
    fs = require('fs'),
    swig = require('swig'),
    jsontoxml = require('jsontoxml'),
    config = require(path.resolve('./server/config')),
    events = require(path.resolve('modules/application/services/events')),
    _ = require('lodash');

exports.embedRender = (req, res, next) => {
  
}
/**
 * Oembed Implementation
 * Specification: https://oembed.com/
 * @param req
 * @param res
 * @param next
 */

exports.getEmbed = function(req, res, next) {

    const url = req.query.url;

    const format = req.query.format || 'json';

    const maxWidth = req.query.maxWidth;

    const maxHeight = req.query.maxHeight;

    const responseType = req.query.responseType || 'iframe';

    if(['json', 'xml'].indexOf(format) === -1) {
        return res.status(400).json({message: 'Incorrect format: '+ format + 'Either use: json or xml'});
    }

    if(!url) {
        if(format === 'xml') {
            res.set('Content-Type', 'text/xml');
            return res.status(400).send(jsontoxml({message: 'url is required'}));

        }

        return res.status(400).json({message: 'url is required'});
    }

    let urlParts = url.split('/');

    const notFoundMessage = {message: 'No embed resource found for this url'};

    if(urlParts[urlParts.length - 2] !== 'itineraries') {
        if(format === 'xml') {
            res.set('Content-Type', 'text/xml');
            return res.status(404).send(jsontoxml(notFoundMessage));

        }

        return res.status(404).json(notFoundMessage);
    }

    const result = {
        type: 'rich',
        version: '1.0',
        title: itinerary.name,
        provider_name: 'Namchey',
        provider_url: config.app.site,
        height: maxHeight ? maxHeight : '300',
        width: maxWidth ? maxWidth : '100%',
        author_name: 'Namchey',
        author_url: `https://namchey.com`
    };

    result.html = `<iframe height="${result.height}" width="${result.width}" src="${config.app.site}/embed" frameborder="0" allowfullscreen></iframe>`;

    events.publish({
        action: 'viewed',
        type: 'embed'
    }, req);

    if(format === 'json') {
        return res.json(result);
    }

    if(format === 'xml') {
        const xmlResult = {oembed: [result]};
        result.html = `&lt;iframe height="${result.height}" width="${result.width}" src="${config.app.site}/embed" frameborder="0" allowfullscreen&gt;&lt;/iframe&gt;`;
        const oembedXml = jsontoxml(xmlResult, { xmlHeader: { standalone: 'yes', encoding: 'UTF-16' }});
        res.set('Content-Type', 'text/xml');
        return res.send(oembedXml);
    }

};
