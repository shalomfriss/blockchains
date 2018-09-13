import React from 'react';
import { VarInt } from './VarInt';

test('Check var int prefixes', () => {
		let varint = new VarInt()
		
		//<= fc should have no prefix
		varint.value = "1a"
		expect(varint.prefix).toEqual("")
		
		varint.value = "fc"
		expect(varint.prefix).toEqual("")
		
		varint.value = "fd"
		expect(varint.prefix).toEqual("fd")
		
		//<= ffff should have fd prefix
		varint.value = "1aa"
		expect(varint.prefix).toEqual("fd")
		
		varint.value = "ffff"
		expect(varint.prefix).toEqual("fd")
		
		varint.value = "ffff1"
		expect(varint.prefix).toEqual("fe")
		
		//<= ffffffff should have fe prefix fe
		varint.value = "fffffc"
		expect(varint.prefix).toEqual("fe")
		
		varint.value = "ffff123"
		expect(varint.prefix).toEqual("fe")
		
		varint.value = "ffffffff1"
		expect(varint.prefix).toEqual("ff")
		
		
		//<= ffffffffffffffff should have prefix ff
		varint.value = "123123123"
		expect(varint.prefix).toEqual("ff")
		
		varint.value = "ffffffffffff12"
		expect(varint.prefix).toEqual("ff")
		
		varint.value = "ffffffffffffffff"
		expect(varint.prefix).toEqual("ff")
		
		//If the number is too large throw an exception
		try {
			varint.value = "ffffffffffffffff1"
			expect(varint.prefix).toEqual("ff")
		}
		catch (err) {
			expect(true).toEqual(true)
			return
		}
		
		expect(true).toEqual(false)
		
})


test('Check string representation endieness', () => {
	let varint = new VarInt()
		
	varint.value = "1a"
	expect(varint.value).toEqual("1a")
	
	varint.value = "1aa"
	expect(varint.value).toEqual("fdaa01")
	
	varint.value = "123123123"
	expect(varint.value).toEqual("ff2331122301000000")
	
	varint.value = "ffff123"
	expect(varint.value).toEqual("fe23f1ff0f")
	
	
})