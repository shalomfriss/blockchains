import React from 'react';
import { KeyGenerator } from './KeyGenerator';
import { CryptoUtil } from './KeyGenerator';

test('check that private key is less than 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140 and is 256 bits', () => {
		
	var ecdsa = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140"
	var limit = new sjcl.bn(ecdsa)
	
  	var privateKey = KeyGenerator.generatePrivateKey()
  	var theNumber = new sjcl.bn("0x" + privateKey)  
  	var lenInBytes = privateKey.toString().length/2
  	
  	expect(lenInBytes).toEqual(32)
  	expect(theNumber.greaterEquals(limit)).toEqual(0)
})

test('check that wif generated from private key is accurate', () => {
	//tested with keys from the book  mastering bitcoin 
	var pkey = "1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd"
	var wif = KeyGenerator.wifFromPrivateKey(pkey, false)
	
	expect(wif).toEqual("5J3mBbAH58CpQ3Y5RNJpUKPE62SQ5tfcvU2JpbnkeyhfsYB1Jcn")
})

test('check that wif compressed generated from private key is accurate', () => {
	//tested with keys from the book  mastering bitcoin 
	var pkey = "1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd"
	var wif = KeyGenerator.wifCompressedFromPrivateKey(pkey, false)
	
	expect(wif).toEqual("KxFC1jmwwCoACiCAWZ3eXa96mBM6tb3TYzGmf6YwgdGWZgawvrtJ")
})

test('check the wif checksum', () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var wif = KeyGenerator.wifFromPrivateKey(pkey, false)
	var test = KeyGenerator.checkWIFChecksum(wif)
	
	expect(test).toBe(true)
})

test("check private key from wif", () => {
	var pkey = "1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd".toUpperCase()
	var wif = KeyGenerator.wifFromPrivateKey(pkey, false)
	
	var keyFromWif = KeyGenerator.privateKeyFromWIF(wif)
	expect(keyFromWif).toEqual(pkey)
})

test("check private key from  compressed wif", () => {
	var pkey = "1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd".toUpperCase()
	var wif = KeyGenerator.wifCompressedFromPrivateKey(pkey, false)
	
	var keyFromWif = KeyGenerator.privateKeyFromWIF(wif)
	expect(keyFromWif).toEqual(pkey + "01")
})

test("Generate a public key from a private key", () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var pubKey = KeyGenerator.generatePublicKey(pkey)
	
	expect(pubKey.x).toEqual("D0988BFA799F7D7EF9AB3DE97EF481CD0F75D2367AD456607647EDDE665D6F6F".toUpperCase())
	expect(pubKey.y).toEqual("BDD594388756A7BEAF73B4822BC22D36E9BDA7DB82DF2B8B623673EEFC0B7495".toUpperCase())
})


test("Generate a public key from a private key for bitcoin", () => {
	var pkey = "3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6"
	var pubKey = KeyGenerator.generateBitcoinPublicKey(pkey)
				expect(pubKey).toEqual("045c0de3b9c8ab18dd04e3511243ec2952002dbfadc864b9628910169d9b9b00ec243bcefdd4347074d44bd7356d6a53c495737dd96295e2a9374bf5f02ebfc176".toUpperCase())
		
})


test("Generate a compressed public key from a private key for bitcoin", () => {
	var pkey = "3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6"
	var pubKey = KeyGenerator.generateCompressedBitcoinPublicKey(pkey)
	expect(pubKey).toEqual("025c0de3b9c8ab18dd04e3511243ec2952002dbfadc864b9628910169d9b9b00ec".toUpperCase())
		
})

test("Check bitcoin address generation", () => {
	var pkey = "3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6"
	var address = KeyGenerator.generateBitcoinAddressFromPrivateKey(pkey)
	expect(address).toEqual("1thMirt546nngXqyPEz532S8fLwbozud8")
		
})

test("Check compressed bitcoin address generation", () => {
	var pkey = "3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6"
	var pubkey = KeyGenerator.generateCompressedBitcoinPublicKey(pkey)
	console.log("Compressed public key: " + pubkey)
	var address = KeyGenerator.generateBitcoinAddressFromPublicKey(pubkey)
	expect(address).toEqual("14cxpo3MBCYYWCgF74SWTdcmxipnGUsPw3")
		
})

