import React from 'react';
import { ByteUtils } from './ByteUtils';

test('Make sure endianess conversion is working', () => {
	
	var hex = "12345"
	expect(ByteUtils.toLittleEndian(hex)).toEqual("45231")
	hex = "45231"
	expect(ByteUtils.toBigEndian(hex)).toEqual("12345")
	
	hex = "12345678"
	expect(ByteUtils.toLittleEndian(hex)).toEqual("78563412")
	hex = "78563412"
	expect(ByteUtils.toBigEndian(hex)).toEqual("12345678")
	
	hex = "0"
	expect(ByteUtils.toLittleEndian(hex)).toEqual("0")
	expect(ByteUtils.toBigEndian(hex)).toEqual("0")
	
	hex = "01"
	expect(ByteUtils.toLittleEndian(hex)).toEqual("01")
	expect(ByteUtils.toBigEndian(hex)).toEqual("01")
	
	
	hex = "012"
	expect(ByteUtils.toLittleEndian(hex)).toEqual("120")
	expect(ByteUtils.toBigEndian(hex)).toEqual("201")

	hex = "120"
	expect(ByteUtils.toLittleEndian(hex)).toEqual("201")
	expect(ByteUtils.toBigEndian(hex)).toEqual("012")

})