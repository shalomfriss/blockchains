import React from 'react';
import { KeyGenerator } from './KeyGenerator';

test('check that private key is less than 2^256 - 1 and is 256 bits', () => {
	
	var num = new sjcl.bn(2)
	var pow = new sjcl.bn(256)
	var limit = num.power(pow)
	
  	var privateKey = KeyGenerator.generatePrivateKey()
  	var theNumber = new sjcl.bn("0x" + privateKey)  
  	var lenInBytes = privateKey.toString().length/2
  	
  	expect(lenInBytes).toEqual(32)
  	expect(theNumber.greaterEquals(limit)).toEqual(0)
})

test('check that wif generated from private key is accurate', () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var wif = KeyGenerator.generatePrivateKeyWIF(pkey, false)
	
	expect(wif).toEqual("5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD")
})

test('check the wif checksum', () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var wif = KeyGenerator.generatePrivateKeyWIF(pkey, false)
	
	var test = KeyGenerator.checkWIFChecksum(wif)
	
	expect(test).toBe(true)
})

test("check private key from wif", () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var wif = KeyGenerator.generatePrivateKeyWIF(pkey, false)
	
	var keyFromWif = KeyGenerator.privateKeyFromWIF(wif)
	expect(keyFromWif).toEqual(pkey)
	
})

test("Generate a public key from a private key", () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	
	var pubKey = KeyGenerator.generatePublicKeyFromPrivateKey(pkey)
	//expect(pubKey).toEqual(pkey)
	
})