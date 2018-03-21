/**
	A value object representing a Bip 32 key	
*/
export class Bip32Key {
	constructor() {
		this.network			= ""
		this.depth			 	= ""
		this.index 				= ""
		this.parentFingerprint 	= ""
		this.key 				= ""	//key contains checksum on the end
		this.rawKey				= "" 	//Used for raw public key data
		this.chainCode 			= ""
		this.isPrivate 			= ""
	} 
	
	/**
		Check to see if this key is equal to the one provided
		@param toKey:Bip32Key - The bip32 key to compare to	
	*/
	isEqual(toKey) {
			
	}
	
}