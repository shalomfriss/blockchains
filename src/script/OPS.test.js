import React from 'react';
import { OPS, OPSN } from './OPS';

test('Check script constants', () => {
	
	for( var x in OPSN) {
		
		if(x == "hex") {
			continue
		}
		
		let op = OPSN[x]
		let hexString = op.toString(16);
		if(hexString.length < 2) {
			hexString = "0" + hexString
		}
		
		//expect(OPS[x]).toEqual("0x" + hexString)
		expect(OPS[x]).toEqual(hexString)
		
	}
	
})