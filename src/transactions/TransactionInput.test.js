import React from 'react';
import { TransactionInput } from './TransactionInput';

test('Make sure TransactionInput has the correct fields', () => {
	var tx = new TransactionInput()
	expect(tx.hasOwnProperty("txid")).toEqual(true)
	expect(tx.hasOwnProperty("vout")).toEqual(true)
	expect(tx.hasOwnProperty("scriptSig")).toEqual(true)
	expect(tx.hasOwnProperty("sequence")).toEqual(true)
})