import { polyfill } from 'es6-promise';
polyfill();


export function isImageSmall(imageEl) {
  return new Promise((resolve, reject) => {
    if(imageEl) {
      return imageEl.onload = () =>{
        console.log(imageEl.naturalWidth);
        if(imageEl.naturalWidth < 600) {
          console.log('is small', true);
          return resolve({isSmall:true});
        }
        return resolve({isSmall:false});
      }
    }
    //if no image return false
    return resolve({isSmall:false});

  });

}

function splitByWords(str = '', limit = undefined) {
  return str.split(/[-./\\()"',;<>~!@#$%^&*|+=[\]{}`~?:]/u, limit)
}

/**
* Twitter uses 70 characters but it may truncate to fit other devices
* twitter recommends using 50 characters
* using 50 characters
*/
function truncateTitle(title, displayType) {

  if(title.length > 28) {
    if(displayType === 'row') {
      return splitByWords(title, 8).join(' ');
      //return title.substring(0, 50);
    }
    return title.substring(0, 28);
  }
  return title;
}

/**
* Twitter uses 70 characters but it may truncate to fit other devices
* twitter recommends using 50 characters
* using 50 characters
*/
function truncateDescription(description, displayType) {
  if(description.length > 50) {
    if(displayType === 'row') {
      return description.substring(0, 50);
    }
    return `${description.substring(0, 50)}...`;
  }
  return description;
}

export function getTitle(scrape, cardType, displayType) {
  const { json: { opengraph, twittercard, head } } = scrape;
  if(cardType === 'twittercard') {
    if(twittercard['twitter:title']) {
      return truncateTitle(twittercard['twitter:title'], displayType);
    }
  }

  if(cardType === 'opengraph') {
    if(opengraph['og:title']) {
      return truncateTitle(opengraph['og:title'], displayType);
    }
  }

  if(scrape.json.tags && scrape.json.tags.title) {
    return truncateTitle(scrape.json.tags.title, displayType);
  }
  return '';
}

export function getDescription(scrape, cardType, displayType) {
  const { json: { opengraph, twittercard, head } } = scrape;

  if(cardType === 'twittercard') {
    if(twittercard['twitter:description']) {
      return truncateDescription(twittercard['twitter:description'], displayType);
    }
  }

  if(cardType === 'opengraph') {
    if(opengraph['og:description']) {
      return truncateDescription(opengraph['og:description'], displayType);
    }
  }


  if(head && head.length) {
    const description = head.find((value, index, items) => {
      return value.name === 'description';
    });
    return description && truncateDescription(description.content, displayType);
  }

  return '';
}
