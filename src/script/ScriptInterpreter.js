import 'Buffer';
import { OPS } from "./OPS";
import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/codecBytes'; 
import 'sjcl/core/ripemd160';

/**
	A bitcoin script interpreter, most of which was inspired by code from here 
	https://github.com/cryptocoinjs/btc-scriptinterpreter/blob/3303917fd5fcc453e3a09b609598b16a5d7991a5/lib/scriptinterpreter.js
	and here
	https://github.com/bitcoin/bitcoin/blob/master/src/script/interpreter.cpp#L539
		
*/
export class ScriptInterpreter {
	
	constructor() {
		//The stack and the alt stack
		this.stack = []
		this.altstack = []
		this.execStack = []
		this.opCount = 0
		this.script = null
		
		this.MAX_OPCODE_SIZE 	= 520
		this.MAX_OPS_PER_SCRIPT = 200
	}
	
	
	
	/**
		Execute a script	
		@param script:Array - An array containing the script to execute
	*/
	execute(script) {
		this.script = script
		console.log(script.length)
		console.log(this.MAX_OPS_PER_SCRIPT)
		
		//Check script max length
		if(script.length > this.MAX_OPS_PER_SCRIPT) {
			throw new Error("Script length exceeded")
		}
		
		if(script.length === 0) {
			throw new Error("Empty script")
		}
		
		while(this.script.length > 0) {
			this.executeStep()
		}
		
	}
	
	/**
		execute a step
		@param opcode:Buffer|Array - A buffer or array that represents the opcode	
	*/
	executeStep() {
			
			// The execution bit is true if there are no "false" values in the
		    // execution stack. (A "false" value indicates that we're in the
		    // inactive branch of an if statement.)
		    var exec = !~this.execStack.indexOf(false)
		    
		    let opcode = this.pop()
			
			/*
			//Convert to buffer
			if (Array.isArray(opcode)) {
	        	opcode = new Buffer(opcode)
	      	}
	      	*/
	      	
	      	/*
		  	//Only push buffer objects
		  	if (Buffer.isBuffer(opcode)) {
		    	this.stack.push(opcode)
	      	}
		  	*/
		  	
		  	//Max opcode size is 520
			if (opcode.length > this.MAX_OPCODE_SIZE) {
	        	throw new Error("can't push more than " + this.MAX_OPCODE_SIZE);
	      	}
		  	
		  	
		  	if(opcode > OPS.OP_16 && this.opCount + 1 > this.MAX_OPS_PER_SCRIPT) {
			  	throw new Error("Max script length exceeded (200 ops max)")
		  	}
		  	
		  	if(this.isUnsupportedOp(opcode) === true) {
			  	throw new Error("Disabled opcode not allowed")
		  	}
		  	
		  	if(this.isNoOp(opcode) === true) {
			  	return
		  	}		  	
		  	
		  	if(exec) {
		  		
			  	if(this.isInt(opcode) === true) {
				  	if(opcode == OPS.OP_0) { this.push(new sjcl.bn("0x00")) }
				  	
				  	let num = new sjcl.bn("0x" + opcode)
				  	let minusNum = new sjcl.bn("0x50")
				  	let total = num.sub(minusNum)
					this.push(total)					
			  	}
			  	
		  	}
		  	else {
			  	
		  	}
	  	  	          
	}
	
	push(val) {
		this.stack.push(val)
	}

	pop() {
		if (this.stack.length < 1) {
	    	throw new Error('ScriptInterpreter.pop(): Stack underrun');
	  	}	
	  	
	  	return this.stack.pop();
	}	
	
	/*****************************************************************************************************************************/
	//SCRIPT FUNCTIONS
	/*****************************************************************************************************************************/
	
	/**
		Check if an opcode is supported	/ disabled
	*/
	isUnsupportedOp(opcode) {
		
		switch(opcode) {
		  	
		  	case OPS.OP_CAT:
		  	case OPS.OP_SUBSTR:
		  	case OPS.OP_LEFT:
		  	case OPS.OP_RIGHT:
		  	case OPS.OP_INVERT:
		  	case OPS.OP_AND:
		  	case OPS.OP_OR:
		  	case OPS.OP_XOR:
		  	case OPS.OP_2MUL:
		  	case OPS.OP_2DIV:
		  	case OPS.OP_MUL:
		  	case OPS.OP_DIV:
		  	case OPS.OP_MOD:
		  	case OPS.OP_LSHIFT:
		  	case OPS.OP_RSHIFT:
		  		return true
		  	default:
		  		return false
		  		
		 }
	}
	
	/**
		Check if an opcode is a no-op	
	*/
	isNoOp(opcode) {
		
		switch(opcode) {
			
			case OPS.OP_NOP:
			case OPS.OP_NOP1:
			case OPS.OP_NOP2:
			case OPS.OP_NOP3:
			case OPS.OP_NOP4:
			case OPS.OP_NOP5:
			case OPS.OP_NOP6:
			case OPS.OP_NOP7:
			case OPS.OP_NOP8:
			case OPS.OP_NOP9:
			case OPS.OP_NOP10:
	        	return true
	        default:
	        	return false
		}
	}
	
	/**
		Check if op code is simple integer	
	*/
	isInt(opcode) {
		switch(opcode) {
			case OPS.OP_0:
			case OPS.OP_1NEGATE:
			case OPS.OP_1:
			case OPS.OP_2:
			case OPS.OP_3:
			case OPS.OP_4:
			case OPS.OP_5:
			case OPS.OP_6:
			case OPS.OP_7:
			case OPS.OP_8:
			case OPS.OP_9:
			case OPS.OP_10:
			case OPS.OP_11:
			case OPS.OP_12:
			case OPS.OP_13:
			case OPS.OP_14:
			case OPS.OP_15:
			case OPS.OP_16:
				return true
			default:
				return false
		}
	}
	
}