import React from 'react';
import { ScriptInterpreter } from './ScriptInterpreter';
import { OPS } from "./OPS";

//TODO: Make tests more comprehensive

test('Check unsupported ops', () => {
	var si = new ScriptInterpreter()
	
	var test = si.isUnsupportedOp(OPS.OP_CAT)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_CAT)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_SUBSTR)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_LEFT)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_RIGHT)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_INVERT)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_AND)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_OR)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_XOR)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_2MUL)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_2DIV)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_MUL)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_DIV)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_MOD)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_LSHIFT)
	expect(test).toEqual(true)
	test = si.isUnsupportedOp(OPS.OP_RSHIFT)
	expect(test).toEqual(true)
	
})

test('Check noops', () => {
	
	var si = new ScriptInterpreter()
	
	var test = si.isNoOp(OPS.OP_NOP)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP1)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP2)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP3)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP4)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP5)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP6)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP7)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP8)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP9)
	expect(test).toEqual(true)
	test = si.isNoOp(OPS.OP_NOP10)
	expect(test).toEqual(true)
	
})

test('Check script op length limit', () => {
	
	var si = new ScriptInterpreter()
	let script = ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "test"]
	
	try {
		si.execute(script)
	} catch(e) {
		expect(true).toEqual(true)
		return
	}
	
	expect(false).toEqual(true)
	
})

/*
test('Check script length limit', () => {
	console.log("---------------------")
	var script = []
	var si = new ScriptInterpreter()
	for(var i = 0; i < 200; i++) {
		script.push(OPS.OP_NOP)
	}
	
	try {
		si.execute(script)
		expect(true).toEqual(true)
	} catch(e) {
		expect(false).toEqual(true)
		return
	}
	
	
	var script = []
	for(var i = 0; i < 201; i++) {
		script.push(OPS.OP_NOP)
	}
	
	try {
		si.execute(script)
		expect(false).toEqual(true)
	} catch(e) {
		expect(true).toEqual(true)
		return
	}
	
})
*/


test('Check int ops', () => {
	
	var si = new ScriptInterpreter()
	var test = si.isInt(OPS.OP_0)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_1NEGATE)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_1)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_2)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_3)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_4)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_5)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_6)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_7)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_8)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_9)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_10)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_11)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_12)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_13)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_14)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_15)
	expect(test).toEqual(true)
	var test = si.isInt(OPS.OP_16)
	expect(test).toEqual(true)
	
	var test = si.isInt(OPS.OP_CAT)
	expect(test).toEqual(false)
})
