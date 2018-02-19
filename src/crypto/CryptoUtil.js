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
		sjcl.random.stopCollectors()
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
	
	/**
		Get a 32 bit double sha256 checksum from a hex string	
	*/
	static getChecksum32(hex) {
		var bits1 =  sjcl.codec.hex.toBits(hex)
		var hash1 = sjcl.hash.sha256.hash(bits1);  
		var doubleHash  = sjcl.hash.sha256.hash(hash1); 
		doubleHash = sjcl.codec.hex.fromBits(doubleHash); 
		
		var checksum = doubleHash.substr(0, 8).toUpperCase()
		return checksum
	}
	
	static isHex(h) {
		var re = /^[0-9a-fA-F]+$/g;
		return re.test(h)
	}

	
	
	/*		
		//Create base58 check representation of a compressed private key (01 added to the end)
		var b58Private = "80" + masterPrivateKey + "01"
		var b58PrivateChecksum =  CryptoUtil.getChecksum32(b58Private) 
		b58Private = b58Private + b58PrivateChecksum
		var bytes = Buffer.from(b58Private, 'hex')
		var b58CompressedPrivateKey = bs58.encode(bytes)
		console.log("BITCOIN PRIVATE KEY ENCODED: " + b58CompressedPrivateKey)
		*/
		
	
}