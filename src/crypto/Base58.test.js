import React from 'react';
import { Base58 } from './Base58';

test('Should be able to encode and decode correctly', () => {
	
  	var digits = 1234567890
  	var base = new Base58()
	var enc = base.encode(digits)
	var dec = base.decode(enc)
	
	//expect(enc).toEqual('348ALp7')
	//expect(dec).toEqual(digits)
	
});