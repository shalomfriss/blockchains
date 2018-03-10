'use strict';
var sjcl = require('sjcl');

require('./sjcl-ecc-pointextras.js');
require('./sjcl-secp256k1.js');
require('./sjcl-extramath.js');
require('./sjcl-ecdsa-canonical.js');
require('./sjcl-ecdsa-der.js');
require('./sjcl-ecdsa-recoverablepublickey.js');
require('./sjcl-ecdsa-signdeterministic.js');
require('./sjcl-jacobi.js');

module.exports = sjcl;
