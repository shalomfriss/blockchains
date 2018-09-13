import 'Buffer';

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
		
		
	}
	
	/**
		Push a value onto the stack
	*/	
	pushStack(val) {
		if(!val) {
			throw new Error("Empty value")	
		}	
		stack.push(val)
	}
	
	/**
		Pop a value off the stack
	*/	
	popStack() {
		if(stack.length <= 0) {
			throw new Error("Stack is empty")	
		}
		return stack.pop()
	}
	
	/**
		Execute a script	
	*/
	execute(script) {
		
		/*
      if (script.buffer.length > 10000) {
	    callback(new Error("Oversized script (> 10k bytes)"));
	    return this;
	  }
      */
      
	}
	
	
	executeStep(step) {
		
		//Max opcode size is 520
		if (opcode.length > 520) {
        	throw new Error("can't push more than 520 characters");
      	}
	  	
	  	//Check for disabled op codes
	  	if (typeof opcode === "number"  &&
        (opcode === OP_CAT ||
          opcode === OP_SUBSTR ||
          opcode === OP_LEFT ||
          opcode === OP_RIGHT ||
          opcode === OP_INVERT ||
          opcode === OP_AND ||
          opcode === OP_OR ||
          opcode === OP_XOR ||
          opcode === OP_2MUL ||
          opcode === OP_2DIV ||
          opcode === OP_MUL ||
          opcode === OP_DIV ||
          opcode === OP_MOD ||
          opcode === OP_LSHIFT ||
          opcode === OP_RSHIFT)) {
        throw new Error("Disabled opcode not allowed");
      }
      
      if (Array.isArray(opcode)) {
        	opcode = new Buffer(opcode)
      }
      
      if (Buffer.isBuffer(opcode)) {
	    	this.stack.push(opcode);
      }
       
      
      
	}
	
}