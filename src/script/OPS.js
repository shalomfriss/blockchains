/**
	Script op codes 	
*/

export class OPSN {
	
}

export class OPS {
	
}



/***************************************************************************************************************************************/
//OPS NUMBER CODES
/***************************************************************************************************************************************/

OPSN.OP_FALSE 				= 0		//An empty array of bytes is pushed onto the stack
OPSN.OP_0 					= 0		//An empty array of bytes is pushed onto the stack
OPSN.OP_PUSHDATA1 			= 76	//The next opcode bytes is data to be pushed onto the stack
OPSN.OP_PUSHDATA2 			= 77	//The next two bytes contain the number of bytes to be pushed onto the stack in little endian order.
OPSN.OP_PUSHDATA4 			= 78	//The next four bytes contain the number of bytes to be pushed onto the stack in little endian order.
OPSN.OP_1NEGATE 			= 79	//The number -1 is pushed onto the stack.
OPSN.OP_RESERVED 			= 80	//Transaction is invalid unless occuring in an unexecuted OP_IF branch
OPSN.OP_TRUE 				= 81	//The number 1 is pushed onto the stack.
OPSN.OP_1 					= 81	//The number 1 is pushed onto the stack.
OPSN.OP_2 					= 82	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_3 					= 83	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_4 					= 84	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_5 					= 85	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_6 					= 86	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_7 					= 87	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_8 					= 88	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_9 					= 89	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_10 					= 90	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_11 					= 91	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_12 					= 92	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_13 					= 93	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_14 					= 94	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_15 					= 95	//The number in the word name (2-16) is pushed onto the stack.
OPSN.OP_16 					= 96	//The number in the word name (2-16) is pushed onto the stack.

/**
	  Flow control
*/
OPSN.OP_NOP 				= 97	//Does nothing.
OPSN.OP_VER 				= 98	//Transaction is invalid unless occuring in an unexecuted OP_IF branch
OPSN.OP_IF 					= 99	//If the top stack value is not False, the statements are executed. The top stack value is removed.
OPSN.OP_NOTIF 				= 100	//If the top stack value is False, the statements are executed. The top stack value is removed.
OPSN.OP_VERIF 				= 101	//Transaction is invalid even when occuring in an unexecuted OP_IF branch
OPSN.OP_VERNOTIF 			= 102	//Transaction is invalid even when occuring in an unexecuted OP_IF branch
OPSN.OP_ELSE 				= 103	//If the preceding OP_IF or OP_NOTIF or OP_ELSE was not executed then these statements 
									//are and if the preceding OP_IF or OP_NOTIF or OP_ELSE was executed then these statements are not.
OPSN.OP_ENDIF 				= 104	//Ends an if/else block. All blocks must end, or the transaction is invalid. An OP_ENDIF without OP_IF earlier is also invalid.
OPSN.OP_VERIFY 				= 105	//Marks transaction as invalid if top stack value is not true. The top stack value is removed.
OPSN.OP_RETURN 				= 106	//Marks transaction as invalid. A standard way of attaching extra data to transactions is to add a 
									//zero-value output with a scriptPubKey consisting of OP_RETURN followed by exactly one pushdata op. 
									//Such outputs are provably unspendable, reducing their cost to the network. Currently it is usually 
									//considered non-standard (though valid) for a transaction to have more than one OP_RETURN output or 
									//an OP_RETURN output with more than one pushdata op.

/**
	  Stack
*/
OPSN.OP_TOALTSTACK 			= 107	//Puts the input onto the top of the alt stack. Removes it from the main stack.
OPSN.OP_FROMALTSTACK 		= 108	//Puts the input onto the top of the main stack. Removes it from the alt stack.
OPSN.OP_2DROP	 			= 109	//Removes the top two stack items.
OPSN.OP_2DUP 				= 110	//Duplicates the top two stack items.
OPSN.OP_3DUP 				= 111	//Duplicates the top three stack items.
OPSN.OP_2OVER 				= 112	//Copies the pair of items two spaces back in the stack to the front.
OPSN.OP_2ROT 				= 113	//The fifth and sixth items back are moved to the top of the stack.
OPSN.OP_2SWAP 				= 114	//Swaps the top two pairs of items.
OPSN.OP_IFDUP 				= 115	//If the top stack value is not 0, duplicate it.
OPSN.OP_DEPTH 				= 116	//Puts the number of stack items onto the stack.
OPSN.OP_DROP 				= 117	//Removes the top stack item.
OPSN.OP_DUP 				= 118	//Duplicates the top stack item.
OPSN.OP_NIP 				= 119	//Removes the second-to-top stack item.
OPSN.OP_OVER 				= 120	//Copies the second-to-top stack item to the top.
OPSN.OP_PICK				= 121	//The item n back in the stack is copied to the top.
OPSN.OP_ROLL 				= 122	//The item n back in the stack is moved to the top.
OPSN.OP_ROT 				= 123	//The top three items on the stack are rotated to the left.
OPSN.OP_SWAP 				= 124	//The top two items on the stack are swapped.
OPSN.OP_TUCK 				= 125	//The item at the top of the stack is copied and inserted before the second-to-top item.

/**
	Splice	  
*/
OPSN.OP_CAT 				= 126	//Concatenates two strings. disabled.
OPSN.OP_SUBSTR 				= 127	//Returns a section of a string. disabled.
OPSN.OP_LEFT 				= 128	//Keeps only characters left of the specified point in a string. disabled.
OPSN.OP_RIGHT 				= 129	//Keeps only characters right of the specified point in a string. disabled.
OPSN.OP_SIZE 				= 130	//Pushes the string length of the top element of the stack (without popping it).

OPSN.OP_INVERT 				= 131	//Flips all of the bits in the input. disabled.
OPSN.OP_AND 				= 132	//Boolean and between each bit in the inputs. disabled.
OPSN.OP_OR 					= 133	//Boolean or between each bit in the inputs. disabled.
OPSN.OP_XOR 				= 134	//Boolean exclusive or between each bit in the inputs. disabled.
OPSN.OP_EQUAL 				= 135	//Returns 1 if the inputs are exactly equal, 0 otherwise.
OPSN.OP_EQUALVERIFY 		= 136	//Same as OP_EQUAL, but runs OP_VERIFY afterward.
OPSN.OP_RESERVED1 			= 137	//Transaction is invalid unless occuring in an unexecuted OP_IF branch
OPSN.OP_RESERVED2 			= 138	//Transaction is invalid unless occuring in an unexecuted OP_IF branch

/**
	  Arithmetic
*/
OPSN.OP_1ADD 				= 139	//1 is added to the input.
OPSN.OP_1SUB 				= 140	//1 is subtracted from the input.
OPSN.OP_2MUL 				= 141	//The input is multiplied by 2. disabled.
OPSN.OP_2DIV				= 142	//The input is divided by 2. disabled.
OPSN.OP_NEGATE 				= 143	//The sign of the input is flipped.
OPSN.OP_ABS 				= 144	//The input is made positive.
OPSN.OP_NOT 				= 145	//If the input is 0 or 1, it is flipped. Otherwise the output will be 0.
OPSN.OP_0NOTEQUAL 			= 146	//Returns 0 if the input is 0. 1 otherwise.
OPSN.OP_ADD 				= 147	//a is added to b.
OPSN.OP_SUB 				= 148	//b is subtracted from a.
OPSN.OP_MUL 				= 149	//a is multiplied by b. disabled.
OPSN.OP_DIV 				= 150	//a is divided by b. disabled.
OPSN.OP_MOD 				= 151	//Returns the remainder after dividing a by b. disabled.
OPSN.OP_LSHIFT 				= 152	//Shifts a left b bits, preserving sign. disabled.
OPSN.OP_RSHIFT			 	= 153	//Shifts a right b bits, preserving sign. disabled.

OPSN.OP_BOOLAND 			= 154	//If both a and b are not "" (null string), the output is 1. Otherwise 0.
OPSN.OP_BOOLOR 				= 155	//If a or b is not "" (null string), the output is 1. Otherwise 0.
OPSN.OP_NUMEQUAL 			= 156	//Returns 1 if the numbers are equal, 0 otherwise.
OPSN.OP_NUMEQUALVERIFY 		= 157	//Same as OP_NUMEQUAL, but runs OP_VERIFY afterward.
OPSN.OP_NUMNOTEQUAL 		= 158	//Returns 1 if the numbers are not equal, 0 otherwise.
OPSN.OP_LESSTHAN 			= 159	//Returns 1 if a is less than b, 0 otherwise.
OPSN.OP_GREATERTHAN 		= 160	//Returns 1 if a is greater than b, 0 otherwise.
OPSN.OP_LESSTHANOREQUAL 	= 161	//Returns 1 if a is less than or equal to b, 0 otherwise.
OPSN.OP_GREATERTHANOREQUAL 	= 162	//Returns 1 if a is greater than or equal to b, 0 otherwise.
OPSN.OP_MIN 				= 163	//Returns the smaller of a and b.
OPSN.OP_MAX 				= 164	//Returns the larger of a and b.

OPSN.OP_WITHIN 				= 165	//Returns 1 if x is within the specified range (left-inclusive), 0 otherwise.

/**
	  Crypto
*/
OPSN.OP_RIPEMD160 			= 166	//The input is hashed using RIPEMD-160.
OPSN.OP_SHA1 				= 167	//The input is hashed using SHA-1.
OPSN.OP_SHA256 				= 168	//The input is hashed using SHA-256.
OPSN.OP_HASH160 			= 169	//The input is hashed twice: first with SHA-256 and then with RIPEMD-160.
OPSN.OP_HASH256				= 170	//The input is hashed two times with SHA-256.
OPSN.OP_CODESEPARATOR 		= 171	//All of the signature checking words will only match signatures to the data after the most recently-executed OP_CODESEPARATOR.
OPSN.OP_CHECKSIG 			= 172	//The entire transaction's outputs, inputs, and script (from the most recently-executed OP_CODESEPARATOR 
									//to the end) are hashed. The signature used by OP_CHECKSIG must be a valid signature for this hash and public key. 
									//If it is, 1 is returned, 0 otherwise.
OPSN.OP_CHECKSIGVERIFY 		= 173	//Same as OP_CHECKSIG, but OP_VERIFY is executed afterward.
OPSN.OP_CHECKMULTISIG 		= 174	//Compares the first signature against each public key until it finds an ECDSA match. Starting with the subsequent 
									//public key, it compares the second signature against each remaining public key until it finds an ECDSA match. 
									//The process is repeated until all signatures have been checked or not enough public keys remain to produce a 
									//successful result. All signatures need to match a public key. Because public keys are not checked again if they 
									//fail any signature comparison, signatures must be placed in the scriptSig using the same order as their corresponding 
									//public keys were placed in the scriptPubKey or redeemScript. If all signatures are valid, 1 is returned, 0 otherwise. 
									//Due to a bug, one extra unused value is removed from the stack.
							
OPSN.OP_CHECKMULTISIGVERIFY = 175	//Same as OP_CHECKMULTISIG, but OP_VERIFY is executed afterward.

OPSN.OP_NOP1 				= 176	//The word is ignored. Does not mark transaction as invalid.

OPSN.OP_NOP2 				= 177	//
OPSN.OP_CHECKLOCKTIMEVERIFY = 177	//Marks transaction as invalid if the top stack item is greater than the transaction's nLockTime field, 
									//otherwise script evaluation continues as though an OP_NOP was executed. Transaction is also invalid if 1. 
									//the stack is empty; or 2. the top stack item is negative; or 3. the top stack item is greater than or equal 
									//to 500000000 while the transaction's nLockTime field is less than 500000000, or vice versa; or 4. the input's 
									//nSequence field is equal to 0xffffffff. The precise semantics are described in BIP 0065.

OPSN.OP_NOP3 				= 178			
OPSN.OP_CHECKSEQUENCEVERIFY = 178	//Marks transaction as invalid if the relative lock time of the input (enforced by BIP 0068 with nSequence) is 
									//not equal to or longer than the value of the top stack item. The precise semantics are described in BIP 0112.

OPSN.OP_NOP4 				= 179	//The word is ignored. Does not mark transaction as invalid.
OPSN.OP_NOP5 				= 180	//The word is ignored. Does not mark transaction as invalid.
OPSN.OP_NOP6 				= 181	//The word is ignored. Does not mark transaction as invalid.
OPSN.OP_NOP7 				= 182	//The word is ignored. Does not mark transaction as invalid.
OPSN.OP_NOP8 				= 183	//The word is ignored. Does not mark transaction as invalid.
OPSN.OP_NOP9 				= 184	//The word is ignored. Does not mark transaction as invalid.
OPSN.OP_NOP10 				= 185	//The word is ignored. Does not mark transaction as invalid.

OPSN.OP_PUBKEYHASH 			= 253	//Represents a public key hashed with OP_HASH160.
OPSN.OP_PUBKEY 				= 254	//Represents a public key compatible with OP_CHECKSIG.
OPSN.OP_INVALIDOPCODE 		= 255	//Matches any opcode that is not yet assigned.


/***************************************************************************************************************************************/
//OPS HEX CODES
/***************************************************************************************************************************************/

OPS.OP_FALSE 				= "00"
OPS.OP_0 					= "00"
OPS.OP_PUSHDATA1 			= "4c"
OPS.OP_PUSHDATA2 			= "4d"
OPS.OP_PUSHDATA4 			= "4e"
OPS.OP_1NEGATE	 			= "4f"
OPS.OP_RESERVED 			= "50"
OPS.OP_TRUE 				= "51"
OPS.OP_1 					= "51"
OPS.OP_2 					= "52"
OPS.OP_3 					= "53"
OPS.OP_4 					= "54"
OPS.OP_5 					= "55"
OPS.OP_6 					= "56"
OPS.OP_7 					= "57"
OPS.OP_8 					= "58"
OPS.OP_9 					= "59"
OPS.OP_10 					= "5a"
OPS.OP_11 					= "5b"
OPS.OP_12 					= "5c"
OPS.OP_13 					= "5d"
OPS.OP_14 					= "5e"
OPS.OP_15 					= "5f"
OPS.OP_16 					= "60"

/**
	  Flow control
*/
OPS.OP_NOP 					= "61"
OPS.OP_VER 					= "62"	
OPS.OP_IF 					= "63"
OPS.OP_NOTIF 				= "64"
OPS.OP_VERIF 				= "65"
OPS.OP_VERNOTIF	 			= "66"	
OPS.OP_ELSE 				= "67"
OPS.OP_ENDIF 				= "68"
OPS.OP_VERIFY 				= "69"
OPS.OP_RETURN 				= "6a"

/**
	  Stack
*/
OPS.OP_TOALTSTACK 			= "6b"
OPS.OP_FROMALTSTACK 		= "6c"
OPS.OP_2DROP 				= "6d"
OPS.OP_2DUP 				= "6e"
OPS.OP_3DUP 				= "6f"
OPS.OP_2OVER				= "70"
OPS.OP_2ROT 				= "71"
OPS.OP_2SWAP 				= "72"
OPS.OP_IFDUP 				= "73"
OPS.OP_DEPTH 				= "74"
OPS.OP_DROP 				= "75"
OPS.OP_DUP 					= "76"
OPS.OP_NIP 					= "77"
OPS.OP_OVER 				= "78"
OPS.OP_PICK 				= "79"
OPS.OP_ROLL 				= "7a"
OPS.OP_ROT 					= "7b"
OPS.OP_SWAP 				= "7c"
OPS.OP_TUCK 				= "7d"

/**
	Splice	  
*/
OPS.OP_CAT 					= "7e"
OPS.OP_SUBSTR 				= "7f"
OPS.OP_LEFT 				= "80"
OPS.OP_RIGHT 				= "81"
OPS.OP_SIZE 				= "82"

OPS.OP_INVERT 				= "83"
OPS.OP_AND 					= "84"
OPS.OP_OR 					= "85"
OPS.OP_XOR 					= "86"
OPS.OP_EQUAL 				= "87"
OPS.OP_EQUALVERIFY 			= "88"
OPS.OP_RESERVED1 			= "89"
OPS.OP_RESERVED2 			= "8a"

/**
	  Arithmetic
*/
OPS.OP_1ADD 				= "8b"
OPS.OP_1SUB 				= "8c"
OPS.OP_2MUL 				= "8d"
OPS.OP_2DIV 				= "8e"
OPS.OP_NEGATE 				= "8f"
OPS.OP_ABS 					= "90"
OPS.OP_NOT 					= "91"
OPS.OP_0NOTEQUAL 			= "92"
OPS.OP_ADD 					= "93"
OPS.OP_SUB 					= "94"
OPS.OP_MUL 					= "95"
OPS.OP_DIV 					= "96"
OPS.OP_MOD 					= "97"
OPS.OP_LSHIFT 				= "98"
OPS.OP_RSHIFT 				= "99"

OPS.OP_BOOLAND 				= "9a"
OPS.OP_BOOLOR 				= "9b"
OPS.OP_NUMEQUAL 			= "9c"
OPS.OP_NUMEQUALVERIFY 		= "9d"
OPS.OP_NUMNOTEQUAL 			= "9e"
OPS.OP_LESSTHAN 			= "9f"
OPS.OP_GREATERTHAN 			= "a0"
OPS.OP_LESSTHANOREQUAL 		= "a1"
OPS.OP_GREATERTHANOREQUAL 	= "a2"
OPS.OP_MIN 					= "a3"
OPS.OP_MAX 					= "a4"

OPS.OP_WITHIN 				= "a5"

/**
	  Crypto
*/
OPS.OP_RIPEMD160 			= "a6"
OPS.OP_SHA1 				= "a7"
OPS.OP_SHA256 				= "a8"
OPS.OP_HASH160 				= "a9"
OPS.OP_HASH256 				= "aa"
OPS.OP_CODESEPARATOR 		= "ab"
OPS.OP_CHECKSIG 			= "ac"
OPS.OP_CHECKSIGVERIFY 		= "ad"
OPS.OP_CHECKMULTISIG 		= "ae"
OPS.OP_CHECKMULTISIGVERIFY 	= "af"

OPS.OP_NOP1 				= "b0"
OPS.OP_NOP2 				= "b1"

OPS.OP_CHECKLOCKTIMEVERIFY 	= "b1"
//OPS.OP_NOP1 				= "b2"
OPS.OP_NOP3 				= "b2"	
OPS.OP_CHECKSEQUENCEVERIFY 	= "b2"

OPS.OP_NOP4 				= "b3"
OPS.OP_NOP5 				= "b4"
OPS.OP_NOP6 				= "b5"
OPS.OP_NOP7 				= "b6"
OPS.OP_NOP8 				= "b7"
OPS.OP_NOP9 				= "b8"
OPS.OP_NOP10 				= "b9"


OPS.OP_PUBKEYHASH 			= "fd"
OPS.OP_PUBKEY 				= "fe"
OPS.OP_INVALIDOPCODE 		= "ff"


/*
OPS.OP_FALSE 				= "0x00"
OPS.OP_0 					= "0x00"
OPS.OP_PUSHDATA1 			= "0x4c"
OPS.OP_PUSHDATA2 			= "0x4d"
OPS.OP_PUSHDATA4 			= "0x4e"
OPS.OP_1NEGATE	 			= "0x4f"
OPS.OP_RESERVED 			= "0x50"
OPS.OP_TRUE 				= "0x51"
OPS.OP_1 					= "0x51"
OPS.OP_2 					= "0x52"
OPS.OP_3 					= "0x53"
OPS.OP_4 					= "0x54"
OPS.OP_5 					= "0x55"
OPS.OP_6 					= "0x56"
OPS.OP_7 					= "0x57"
OPS.OP_8 					= "0x58"
OPS.OP_9 					= "0x59"
OPS.OP_10 					= "0x5a"
OPS.OP_11 					= "0x5b"
OPS.OP_12 					= "0x5c"
OPS.OP_13 					= "0x5d"
OPS.OP_14 					= "0x5e"
OPS.OP_15 					= "0x5f"
OPS.OP_16 					= "0x60"


OPS.OP_NOP 					= "0x61"
OPS.OP_VER 					= "0x62"	
OPS.OP_IF 					= "0x63"
OPS.OP_NOTIF 				= "0x64"
OPS.OP_VERIF 				= "0x65"
OPS.OP_VERNOTIF	 			= "0x66"	
OPS.OP_ELSE 				= "0x67"
OPS.OP_ENDIF 				= "0x68"
OPS.OP_VERIFY 				= "0x69"
OPS.OP_RETURN 				= "0x6a"


OPS.OP_TOALTSTACK 			= "0x6b"
OPS.OP_FROMALTSTACK 		= "0x6c"
OPS.OP_2DROP 				= "0x6d"
OPS.OP_2DUP 				= "0x6e"
OPS.OP_3DUP 				= "0x6f"
OPS.OP_2OVER				= "0x70"
OPS.OP_2ROT 				= "0x71"
OPS.OP_2SWAP 				= "0x72"
OPS.OP_IFDUP 				= "0x73"
OPS.OP_DEPTH 				= "0x74"
OPS.OP_DROP 				= "0x75"
OPS.OP_DUP 					= "0x76"
OPS.OP_NIP 					= "0x77"
OPS.OP_OVER 				= "0x78"
OPS.OP_PICK 				= "0x79"
OPS.OP_ROLL 				= "0x7a"
OPS.OP_ROT 					= "0x7b"
OPS.OP_SWAP 				= "0x7c"
OPS.OP_TUCK 				= "0x7d"




OPS.OP_CAT 					= "0x7e"
OPS.OP_SUBSTR 				= "0x7f"
OPS.OP_LEFT 				= "0x80"
OPS.OP_RIGHT 				= "0x81"
OPS.OP_SIZE 				= "0x82"

OPS.OP_INVERT 				= "0x83"
OPS.OP_AND 					= "0x84"
OPS.OP_OR 					= "0x85"
OPS.OP_XOR 					= "0x86"
OPS.OP_EQUAL 				= "0x87"
OPS.OP_EQUALVERIFY 			= "0x88"
OPS.OP_RESERVED1 			= "0x89"
OPS.OP_RESERVED2 			= "0x8a"

OPS.OP_1ADD 				= "0x8b"
OPS.OP_1SUB 				= "0x8c"
OPS.OP_2MUL 				= "0x8d"
OPS.OP_2DIV 				= "0x8e"
OPS.OP_NEGATE 				= "0x8f"
OPS.OP_ABS 					= "0x90"
OPS.OP_NOT 					= "0x91"
OPS.OP_0NOTEQUAL 			= "0x92"
OPS.OP_ADD 					= "0x93"
OPS.OP_SUB 					= "0x94"
OPS.OP_MUL 					= "0x95"
OPS.OP_DIV 					= "0x96"
OPS.OP_MOD 					= "0x97"
OPS.OP_LSHIFT 				= "0x98"
OPS.OP_RSHIFT 				= "0x99"

OPS.OP_BOOLAND 				= "0x9a"
OPS.OP_BOOLOR 				= "0x9b"
OPS.OP_NUMEQUAL 			= "0x9c"
OPS.OP_NUMEQUALVERIFY 		= "0x9d"
OPS.OP_NUMNOTEQUAL 			= "0x9e"
OPS.OP_LESSTHAN 			= "0x9f"
OPS.OP_GREATERTHAN 			= "0xa0"
OPS.OP_LESSTHANOREQUAL 		= "0xa1"
OPS.OP_GREATERTHANOREQUAL 	= "0xa2"
OPS.OP_MIN 					= "0xa3"
OPS.OP_MAX 					= "0xa4"

OPS.OP_WITHIN 				= "0xa5"


OPS.OP_RIPEMD160 			= "0xa6"
OPS.OP_SHA1 				= "0xa7"
OPS.OP_SHA256 				= "0xa8"
OPS.OP_HASH160 				= "0xa9"
OPS.OP_HASH256 				= "0xaa"
OPS.OP_CODESEPARATOR 		= "0xab"
OPS.OP_CHECKSIG 			= "0xac"
OPS.OP_CHECKSIGVERIFY 		= "0xad"
OPS.OP_CHECKMULTISIG 		= "0xae"
OPS.OP_CHECKMULTISIGVERIFY 	= "0xaf"

OPS.OP_NOP1 				= "0xb0"
OPS.OP_NOP2 				= "0xb1"

OPS.OP_CHECKLOCKTIMEVERIFY 	= "0xb1"
//OPS.OP_NOP1 				= "0xb2"
OPS.OP_NOP3 				= "0xb2"	
OPS.OP_CHECKSEQUENCEVERIFY 	= "0xb2"

OPS.OP_NOP4 				= "0xb3"
OPS.OP_NOP5 				= "0xb4"
OPS.OP_NOP6 				= "0xb5"
OPS.OP_NOP7 				= "0xb6"
OPS.OP_NOP8 				= "0xb7"
OPS.OP_NOP9 				= "0xb8"
OPS.OP_NOP10 				= "0xb9"


OPS.OP_PUBKEYHASH 			= "0xfd"
OPS.OP_PUBKEY 				= "0xfe"
OPS.OP_INVALIDOPCODE 		= "0xff"
*/