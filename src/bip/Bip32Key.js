/**
	A value object representing a Bip 32 key	
*/
export class Bip32Key {
	constructor() {
		this.network			= ""
		this.depth			 	= ""
		this.index 				= ""
		this.parentFingerprint 	= ""
		this.key 				= ""
		this.chainCode 			= ""
		this.isPrivate 			= ""
	} 
}