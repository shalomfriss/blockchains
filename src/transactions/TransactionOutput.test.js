import React from 'react';
import { TransactionOutput } from './TransactionOutput';

test('Make sure TransactionOutput has the correct properties', () => {
	var tx = new TransactionOutput()
	expect(tx.hasOwnProperty("value")).toEqual(true)
	expect(tx.hasOwnProperty("scriptPubKey")).toEqual(true)
})

