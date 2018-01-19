import {sjcl} from './LocalExports';

export class CryptoUtil {
	
	/**
		Generate a random 256 bit number
		@return number - A random 256 bit number in hex	
	*/
	static getRandomNumber() {
		var randWords = null
		sjcl.random.startCollectors();
		randWords = sjcl.random.randomWords(8, 8)
	    sjcl.random.stopCollectors()
		var hash1 = sjcl.hash.sha256.hash(randWords)  
		var hex = sjcl.codec.hex.fromBits(hash1)
		
		return hex
	}
	
	/**
		Generate a random 128 bit number
		@return number - A random 128 bit number in hex	
	*/
	static getRandomNumber128() {
		var randWords = null
		sjcl.random.startCollectors();
		randWords = sjcl.random.randomWords(4, 8)
		console.log(randWords)
		var temp = sjcl.codec.hex.fromBits(randWords)
		
		return temp
	}
	
	/** 
		convert a hex string to base 64
	*/
	static base64(hex) {
		var pkeyBits = sjcl.codec.hex.toBits(hex.toUpperCase())
		var b64Key = sjcl.codec.base64.fromBits(pkeyBits)
		return b64Key
	}
	
	/** 
		convert a hex string to base 64
	*/
	static unbase64(base64String) {
		
		var bits = sjcl.codec.base64.toBits(base64String)
		var str = sjcl.codec.hex.fromBits(bits)
		return str.toUpperCase()
	}
	
}