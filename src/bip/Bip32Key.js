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
		this.rawKey				= "" 	//Used for raw public key data
		this.chainCode 			= ""
		this.isPrivate 			= ""
	} 
}