import React from 'react';
import { WalletUtil } from './WalletUtil';
import Words from './wordlist.json';
import crypto from 'crypto';

test('Check mnemonic generator', () => {
	//tested with keys from the book  mastering bitcoin 
	var mnemonic = WalletUtil.generateMnemonicWordsFromEntropy('0c1e24e5917779d297e14d45f14e1a1a')
	expect(mnemonic).toEqual('army van defense carry jealous true garbage claim echo media make crunch')
})

test('Check seed generator with no passphrase', () => {
	
	expect.assertions(1);
	var mnemonic = "army van defense carry jealous true garbage claim echo media make crunch"
	var passphrase = ""
	
	var seed = WalletUtil.createSeed(mnemonic, passphrase)  	
	expect(seed).toEqual('5b56c417303faa3fcba7e57400e120a0ca83ec5a4fc9ffba757fbe63fbd77a89a1a3be4c67196f57c39a88b76373733891bfaba16ed27a813ceed498804c0570')
})

test('Check seed generator with passphrase', () => {
	
	expect.assertions(1);
	var mnemonic = "army van defense carry jealous true garbage claim echo media make crunch"
	var passphrase = "SuperDuperSecret"
	
	var seed = WalletUtil.createSeed(mnemonic, passphrase)  	
	expect(seed).toEqual('3b5df16df2157104cfdd22830162a5e170c0161653e3afe6c88defeefb0818c793dbb28ab3ab091897d0715861dc8a18358f80b79d49acf64142ae57037d1d54')
})

test('Check that valid addresses are validated correctly', () => {
	
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i")).toBe(true)
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62j")).toBe(false)

    expect(WalletUtil.validateBitcoinAddress("1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nK9")).toBe(true)
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62X")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("1ANNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("1A Na15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("BZbvjr")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("i55j")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62!")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62iz")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62izz")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nJ9")).toBe(false)
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62I")).toBe(false)
	
})


test('Check that non base58 addresses are not valid', () => {
	expect(WalletUtil.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW620")).toBe(false)

})