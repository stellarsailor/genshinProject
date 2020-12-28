var crypto = require('crypto');

export function createUID (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') 
        .slice(0,len);
}
