let whitelist = ['embed.ly', 'medium.com', 'twitter.com',
  'https://twitter.com', 'https://slack.com', 'https://fb.com',
  'https://facebook.com', 'http://iframely.com/', '*.namchey.site', '*.namchey.com','*.googleapis.com'];

if(process.env.NODE_ENV === 'development') {
    whitelist = whitelist.concat(['http://*.localhost:4000', 'http://localhost:4000']);
}

exports.whitelist = whitelist;
