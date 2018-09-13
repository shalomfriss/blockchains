export class ScriptConstants {
	
	var ops = {
		/**
			Constants
		*/
	  "OP_FALSE": 		0,			//An empty array of bytes is pushed onto the stack
	  "OP_0": 0,				//An empty array of bytes is pushed onto the stack
	  "OP_PUSHDATA1": 76,		//The next opcode bytes is data to be pushed onto the stack
	  "OP_PUSHDATA2": 77,		//The next two bytes contain the number of bytes to be pushed onto the stack in little endian order.
	  "OP_PUSHDATA4": 78,		//The next four bytes contain the number of bytes to be pushed onto the stack in little endian order.
	  "OP_1NEGATE": 79,			//The number -1 is pushed onto the stack.
	  "OP_RESERVED": 80,		//Transaction is invalid unless occuring in an unexecuted OP_IF branch
	  "OP_TRUE": 81,			//The number 1 is pushed onto the stack.
	  "OP_1": 81,				//The number 1 is pushed onto the stack.
	  "OP_2": 82,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_3": 83,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_4": 84,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_5": 85,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_6": 86,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_7": 87,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_8": 88,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_9": 89,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_10": 90,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_11": 91,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_12": 92,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_13": 93,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_14": 94,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_15": 95,				//The number in the word name (2-16) is pushed onto the stack.
	  "OP_16": 96,				//The number in the word name (2-16) is pushed onto the stack.
	
	  /**
		  Flow control
	  */
	  "OP_NOP": 97,				//Does nothing.
	  "OP_VER": 98,				//Transaction is invalid unless occuring in an unexecuted OP_IF branch
	  "OP_IF": 99,				//If the top stack value is not False, the statements are executed. The top stack value is removed.
	  "OP_NOTIF": 100,			//If the top stack value is False, the statements are executed. The top stack value is removed.
	  "OP_VERIF": 101,			//Transaction is invalid even when occuring in an unexecuted OP_IF branch
	  "OP_VERNOTIF": 102,		//Transaction is invalid even when occuring in an unexecuted OP_IF branch
	  "OP_ELSE": 103,			//If the preceding OP_IF or OP_NOTIF or OP_ELSE was not executed then these statements 
	  							//are and if the preceding OP_IF or OP_NOTIF or OP_ELSE was executed then these statements are not.
	  "OP_ENDIF": 104,			//Ends an if/else block. All blocks must end, or the transaction is invalid. An OP_ENDIF without OP_IF earlier is also invalid.
	  "OP_VERIFY": 105,			//Marks transaction as invalid if top stack value is not true. The top stack value is removed.
	  "OP_RETURN": 106,			//Marks transaction as invalid. A standard way of attaching extra data to transactions is to add a 
	  							//zero-value output with a scriptPubKey consisting of OP_RETURN followed by exactly one pushdata op. 
	  							//Such outputs are provably unspendable, reducing their cost to the network. Currently it is usually 
	  							//considered non-standard (though valid) for a transaction to have more than one OP_RETURN output or 
	  							//an OP_RETURN output with more than one pushdata op.
	
	  /**
		  Stack
	  */
	  "OP_TOALTSTACK": 107,		//Puts the input onto the top of the alt stack. Removes it from the main stack.
	  "OP_FROMALTSTACK": 108,	//Puts the input onto the top of the main stack. Removes it from the alt stack.
	  "OP_2DROP": 109,			//Removes the top two stack items.
	  "OP_2DUP": 110,			//Duplicates the top two stack items.
	  "OP_3DUP": 111,			//Duplicates the top three stack items.
	  "OP_2OVER": 112,			//Copies the pair of items two spaces back in the stack to the front.
	  "OP_2ROT": 113,			//The fifth and sixth items back are moved to the top of the stack.
	  "OP_2SWAP": 114,			//Swaps the top two pairs of items.
	  "OP_IFDUP": 115,			//If the top stack value is not 0, duplicate it.
	  "OP_DEPTH": 116,			//Puts the number of stack items onto the stack.
	  "OP_DROP": 117,			//Removes the top stack item.
	  "OP_DUP": 118,			//Duplicates the top stack item.
	  "OP_NIP": 119,			//Removes the second-to-top stack item.
	  "OP_OVER": 120,			//Copies the second-to-top stack item to the top.
	  "OP_PICK": 121,			//The item n back in the stack is copied to the top.
	  "OP_ROLL": 122,			//The item n back in the stack is moved to the top.
	  "OP_ROT": 123,			//The top three items on the stack are rotated to the left.
	  "OP_SWAP": 124,			//The top two items on the stack are swapped.
	  "OP_TUCK": 125,			//The item at the top of the stack is copied and inserted before the second-to-top item.
	
	  /**
		Splice	  
	  */
	  "OP_CAT": 126,			//Concatenates two strings. disabled.
	  "OP_SUBSTR": 127,			//Returns a section of a string. disabled.
	  "OP_LEFT": 128,			//Keeps only characters left of the specified point in a string. disabled.
	  "OP_RIGHT": 129,			//Keeps only characters right of the specified point in a string. disabled.
	  "OP_SIZE": 130,			//Pushes the string length of the top element of the stack (without popping it).
	
	  "OP_INVERT": 131,			//Flips all of the bits in the input. disabled.
	  "OP_AND": 132,			//Boolean and between each bit in the inputs. disabled.
	  "OP_OR": 133,				//Boolean or between each bit in the inputs. disabled.
	  "OP_XOR": 134,			//Boolean exclusive or between each bit in the inputs. disabled.
	  "OP_EQUAL": 135,			//Returns 1 if the inputs are exactly equal, 0 otherwise.
	  "OP_EQUALVERIFY": 136,	//Same as OP_EQUAL, but runs OP_VERIFY afterward.
	  "OP_RESERVED1": 137,		//Transaction is invalid unless occuring in an unexecuted OP_IF branch
	  "OP_RESERVED2": 138,		//Transaction is invalid unless occuring in an unexecuted OP_IF branch
	  
	  /**
		  Arithmetic
	  */
	  "OP_1ADD": 139,			//1 is added to the input.
	  "OP_1SUB": 140,			//1 is subtracted from the input.
	  "OP_2MUL": 141,			//The input is multiplied by 2. disabled.
	  "OP_2DIV": 142,			//The input is divided by 2. disabled.
	  "OP_NEGATE": 143,			//The sign of the input is flipped.
	  "OP_ABS": 144,			//The input is made positive.
	  "OP_NOT": 145,			//If the input is 0 or 1, it is flipped. Otherwise the output will be 0.
	  "OP_0NOTEQUAL": 146,		//Returns 0 if the input is 0. 1 otherwise.
	  "OP_ADD": 147,			//a is added to b.
	  "OP_SUB": 148,			//b is subtracted from a.
	  "OP_MUL": 149,			//a is multiplied by b. disabled.
	  "OP_DIV": 150,			//a is divided by b. disabled.
	  "OP_MOD": 151,			//Returns the remainder after dividing a by b. disabled.
	  "OP_LSHIFT": 152,			//Shifts a left b bits, preserving sign. disabled.
	  "OP_RSHIFT": 153,			//Shifts a right b bits, preserving sign. disabled.
	
	  "OP_BOOLAND": 154,		//If both a and b are not "" (null string), the output is 1. Otherwise 0.
	  "OP_BOOLOR": 155,			//If a or b is not "" (null string), the output is 1. Otherwise 0.
	  "OP_NUMEQUAL": 156,		//Returns 1 if the numbers are equal, 0 otherwise.
	  "OP_NUMEQUALVERIFY": 157,	//Same as OP_NUMEQUAL, but runs OP_VERIFY afterward.
	  "OP_NUMNOTEQUAL": 158,	//Returns 1 if the numbers are not equal, 0 otherwise.
	  "OP_LESSTHAN": 159,		//Returns 1 if a is less than b, 0 otherwise.
	  "OP_GREATERTHAN": 160,	//Returns 1 if a is greater than b, 0 otherwise.
	  "OP_LESSTHANOREQUAL": 161,	//Returns 1 if a is less than or equal to b, 0 otherwise.
	  "OP_GREATERTHANOREQUAL": 162,	//Returns 1 if a is greater than or equal to b, 0 otherwise.
	  "OP_MIN": 163,			//Returns the smaller of a and b.
	  "OP_MAX": 164,			//Returns the larger of a and b.
	
	  "OP_WITHIN": 165,			//Returns 1 if x is within the specified range (left-inclusive), 0 otherwise.

	  /**
		  Crypto
	  */
	  "OP_RIPEMD160": 166,		//The input is hashed using RIPEMD-160.
	  "OP_SHA1": 167,			//The input is hashed using SHA-1.
	  "OP_SHA256": 168,			//The input is hashed using SHA-256.
	  "OP_HASH160": 169,		//The input is hashed twice: first with SHA-256 and then with RIPEMD-160.
	  "OP_HASH256": 170,		//The input is hashed two times with SHA-256.
	  "OP_CODESEPARATOR": 171,	//All of the signature checking words will only match signatures to the data after the most recently-executed OP_CODESEPARATOR.
	  "OP_CHECKSIG": 172,		//The entire transaction's outputs, inputs, and script (from the most recently-executed OP_CODESEPARATOR 
	  							//to the end) are hashed. The signature used by OP_CHECKSIG must be a valid signature for this hash and public key. 
	  							//If it is, 1 is returned, 0 otherwise.
	  "OP_CHECKSIGVERIFY": 173,	//Same as OP_CHECKSIG, but OP_VERIFY is executed afterward.
	  "OP_CHECKMULTISIG": 174,	//Compares the first signature against each public key until it finds an ECDSA match. Starting with the subsequent 
	  							//public key, it compares the second signature against each remaining public key until it finds an ECDSA match. 
	  							//The process is repeated until all signatures have been checked or not enough public keys remain to produce a 
	  							//successful result. All signatures need to match a public key. Because public keys are not checked again if they 
	  							//fail any signature comparison, signatures must be placed in the scriptSig using the same order as their corresponding 
	  							//public keys were placed in the scriptPubKey or redeemScript. If all signatures are valid, 1 is returned, 0 otherwise. 
	  							//Due to a bug, one extra unused value is removed from the stack.
	  							
	  "OP_CHECKMULTISIGVERIFY": 175,	//Same as OP_CHECKMULTISIG, but OP_VERIFY is executed afterward.
	
	  "OP_NOP1": 176,					//The word is ignored. Does not mark transaction as invalid.
	  
	  "OP_NOP2": 177,					//
	  "OP_CHECKLOCKTIMEVERIFY": 177,	//Marks transaction as invalid if the top stack item is greater than the transaction's nLockTime field, 
	  									//otherwise script evaluation continues as though an OP_NOP was executed. Transaction is also invalid if 1. 
	  									//the stack is empty; or 2. the top stack item is negative; or 3. the top stack item is greater than or equal 
	  									//to 500000000 while the transaction's nLockTime field is less than 500000000, or vice versa; or 4. the input's 
	  									//nSequence field is equal to 0xffffffff. The precise semantics are described in BIP 0065.
	
	  "OP_NOP3": 178,			
	  "OP_CHECKSEQUENCEVERIFY": 178,	//Marks transaction as invalid if the relative lock time of the input (enforced by BIP 0068 with nSequence) is 
	  									//not equal to or longer than the value of the top stack item. The precise semantics are described in BIP 0112.
	  
	  "OP_NOP4": 179,					//The word is ignored. Does not mark transaction as invalid.
	  "OP_NOP5": 180,					//The word is ignored. Does not mark transaction as invalid.
	  "OP_NOP6": 181,					//The word is ignored. Does not mark transaction as invalid.
	  "OP_NOP7": 182,					//The word is ignored. Does not mark transaction as invalid.
	  "OP_NOP8": 183,					//The word is ignored. Does not mark transaction as invalid.
	  "OP_NOP9": 184,					//The word is ignored. Does not mark transaction as invalid.
	  "OP_NOP10": 185,					//The word is ignored. Does not mark transaction as invalid.
	
	  "OP_PUBKEYHASH": 253,				//Represents a public key hashed with OP_HASH160.
	  "OP_PUBKEY": 254,					//Represents a public key compatible with OP_CHECKSIG.
	  "OP_INVALIDOPCODE": 255			//Matches any opcode that is not yet assigned.
	}
	
	/***************************************************************************************************************************************/
	//OPS HEX CODES
	/***************************************************************************************************************************************/
	
	var opsHex = {
		
		"OP_FALSE" : "0x00",
		"OP_0" : "0x00",
		"OP_PUSHDATA1" : "0x4c",
		"OP_PUSHDATA2" : "0x4d",
		"OP_PUSHDATA4" : "0x4e",
		"OP_1NEGATE" : "0x4f",
		"OP_RESERVED": "0x50",
		"OP_TRUE" : "0x51",
		"OP_1" : "0x51",
		"OP_2" : "0x52",
		"OP_3" : "0x53",
		"OP_4" : "0x54",
		"OP_5" : "0x55",
		"OP_6" : "0x56",
		"OP_7" : "0x57",
		"OP_8" : "0x58",
		"OP_9" : "0x59",
		"OP_10" : "0x5a",
		"OP_11" : "0x5b",
		"OP_12" : "0x5c",
		"OP_13" : "0x5d",
		"OP_14" : "0x5e",
		"OP_15" : "0x5f",
		"OP_16" : "0x60",
		
		
		"OP_NOP" : "0x61",
		"OP_VER": "0x62",	
		"OP_IF" : "0x63",
		"OP_NOTIF" : "0x64",
		"OP_VERIF": "0x65",
		"OP_VERNOTIF": "0x66",	
		"OP_ELSE" : "0x67",
		"OP_ENDIF" : "0x68",
		"OP_VERIFY" : "0x69",
		"OP_RETURN" : "0x6a",
		
		
		"OP_TOALTSTACK" : "0x6b",
		"OP_FROMALTSTACK" : "0x6c",
		"OP_2DROP" : "0x6d",
		"OP_2DUP" : "0x6e",
		"OP_3DUP" : "0x6f",
		"OP_2OVER" : "0x70",
		"OP_2ROT" : "0x71",
		"OP_2SWAP" : "0x72",
		"OP_IFDUP" : "0x73",
		"OP_DEPTH" : "0x74",
		"OP_DROP" : "0x75",
		"OP_DUP" : "0x76",
		"OP_NIP" : "0x77",
		"OP_OVER" : "0x78",
		"OP_PICK" : "0x79",
		"OP_ROLL" : "0x7a",
		"OP_ROT" : "0x7b",
		"OP_SWAP" : "0x7c",
		"OP_TUCK" : "0x7d",
		
		
		
		
		"OP_CAT" : "0x7e",
		"OP_SUBSTR" : "0x7f",
		"OP_LEFT" : "0x80",
		"OP_RIGHT" : "0x81",
		"OP_SIZE" : "0x82",
		
		"OP_INVERT" : "0x83",
		"OP_AND" : "0x84",
		"OP_OR" : "0x85",
		"OP_XOR" : "0x86",
		"OP_EQUAL" : "0x87",
		"OP_EQUALVERIFY" : "0x88",
		"OP_RESERVED1" : "0x89",
		"OP_RESERVED2" : "0x8a",
		
		"OP_1ADD" : "0x8b",
		"OP_1SUB" : "0x8c",
		"OP_2MUL" : "0x8d",
		"OP_2DIV" : "0x8e",
		"OP_NEGATE" : "0x8f",
		"OP_ABS" : "0x90",
		"OP_NOT" : "0x91",
		"OP_0NOTEQUAL" : "0x92",
		"OP_ADD" : "0x93",
		"OP_SUB" : "0x94",
		"OP_MUL" : "0x95",
		"OP_DIV" : "0x96",
		"OP_MOD" : "0x97",
		"OP_LSHIFT" : "0x98",
		"OP_RSHIFT" : "0x99",
		
		"OP_BOOLAND" : "0x9a",
		"OP_BOOLOR" : "0x9b",
		"OP_NUMEQUAL" : "0x9c",
		"OP_NUMEQUALVERIFY" : "0x9d",
		"OP_NUMNOTEQUAL" : "0x9e",
		"OP_LESSTHAN" : "0x9f",
		"OP_GREATERTHAN" : "0xa0",
		"OP_LESSTHANOREQUAL" : "0xa1",
		"OP_GREATERTHANOREQUAL" : "0xa2",
		"OP_MIN" : "0xa3",
		"OP_MAX" : "0xa4",
		
		"OP_WITHIN" : "0xa5",
		
		
		"OP_RIPEMD160" : "0xa6",
		"OP_SHA1" : "0xa7",
		"OP_SHA256" : "0xa8",
		"OP_HASH160" : "0xa9",
		"OP_HASH256" : "0xaa",
		"OP_CODESEPARATOR" : "0xab",
		"OP_CHECKSIG" : "0xac",
		"OP_CHECKSIGVERIFY" : "0xad",
		"OP_CHECKMULTISIG" : "0xae",
		"OP_CHECKMULTISIGVERIFY" : "0xaf",
		
		"OP_NOP1" : "0xb0",
		"OP_NOP2" : "0xb1",
		
		"OP_CHECKLOCKTIMEVERIFY" : "0xb1",
		"OP_NOP1" : "0xb2",
		"OP_CHECKSEQUENCEVERIFY" : "0xb2",
		
		"OP_NOP4" : "0xb3",
		"OP_NOP5" : "0xb4",
		"OP_NOP6" : "0xb5",
		"OP_NOP7" : "0xb6",
		"OP_NOP8" : "0xb7",
		"OP_NOP9" : "0xb8",
		"OP_NOP10" : "0xb9"
		
		
		"OP_PUBKEYHASH" : "0xfd",
		"OP_PUBKEY" : "0xfe",
		"OP_INVALIDOPCODE" : "0xff",
		
		
	}
	
}