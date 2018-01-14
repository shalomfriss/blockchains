import React from 'react';
import { KeyGenerator } from './KeyGenerator';
import bigInt from 'big-integer';

test('check that private key is less than 2^256 - 1', () => {
	
	var b1 = bigInt(2).pow(256)
	b1 = b1.minus(1)
	
  	var privateKey = KeyGenerator.generatePrivateKey()
  	var privateKeyInt = bigInt(privateKey.toString(), 16)
  	
  	expect(privateKeyInt.lt(b1)).toBe(true)
	
})

test('check that wif generated from private key is accurate', () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var wif = KeyGenerator.generatePrivateKeyWIF(pkey, false)
	
	expect(wif).toEqual("5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD")
})

test('check the wif checksum', () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var wif = KeyGenerator.generatePrivateKeyWIF(pkey, false)
	
	console.log("PRE WIF: " + wif)
	var test = KeyGenerator.checkWIFChecksum(wif)
	
	expect(test).toBe(true)
})