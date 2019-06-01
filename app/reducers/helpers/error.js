import { typeChecker } from 'utils';
export const ERR_MESSAGE = 'Something wrong Happened';
/**
 * Error handler
 * @param error
 * @returns String
 */
export function errorHandler(error) {
  if (error && error.response && error.response.body && error.response.body.message) {
    // The request was made, but the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.body.message;
  } else if(error && error.response && error.response.body &&  typeChecker.get(error.response.body) === typeChecker.string) {
    // Something happened in setting up the request that triggered an Error or a network error
    //if network error app reducer handles it.
    return '';
  } else {
    return ERR_MESSAGE;
  }
}
