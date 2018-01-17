import bs58 from 'bs58';

//Hack to get the sjcl modules to load correctly
import {sjcl} from './LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 

	

export class KeyGenerator {
	
	/** 
		Generate a Bitcoin compliant private key.  
		@return privateKey - A hex number that is between 1 and 2^256
	*/
	static generatePrivateKey() {
		
		var num = new sjcl.bn(2)
		var pow = new sjcl.bn(256)
		var limit = num.power(pow)
		
		var privateKey = KeyGenerator.getRandomNumber()
		
		var theNumber = new sjcl.bn("0x" + privateKey)
		while(theNumber.greaterEquals(limit) != 0)
		{
			privateKey = KeyGenerator.getRandomNumber()
			theNumber = new sjcl.bn("0x" + privateKey)
		}
		return privateKey		
	}
	
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
		
	static privateKeyFromWIF(wif) {
		
		//Convert from base58
		var bytes = bs58.decode(wif)
		var hex = bytes.toString('hex')
		
		var subs = hex.substr(0, hex.length - 8)
		var subs2 = subs.substr(2, hex.length)
		
		return subs2.toUpperCase()
	}
	
	static generatePrivateKeyWIF(privateKey, testnet = false) {
		
		
		//privateKey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
		//testnet = false
		
		//console.log("Private key: " + privateKey)
		
		
		//Add WIF prefix
		//testnet / regtest
		var privateKeyAndVersion = "";
		if(testnet == true) {
			privateKeyAndVersion = "ef" + privateKey
		}
		else { //mainnet 
			privateKeyAndVersion = "80" + privateKey
		}
		
		//console.log("Private key with prefix: " + privateKeyAndVersion)
		
		
		var bits1 =  sjcl.codec.hex.toBits(privateKeyAndVersion)
		var hash1 = sjcl.hash.sha256.hash(bits1);  
		//console.log("HASH1: " + sjcl.codec.hex.fromBits(hash1))
		
		
		var doubleHash  = sjcl.hash.sha256.hash(hash1); 
		doubleHash = sjcl.codec.hex.fromBits(doubleHash); 
		//console.log("HASH2: " + doubleHash)
		
		var checksum = doubleHash.substr(0, 8).toUpperCase()
		//console.log("Checksum: " + checksum)
		
		//Add to current result
		var hashWithChecksum = privateKeyAndVersion + checksum
		//console.log("Hash With checksum added: " + hashWithChecksum)
		
		//Encode to base58
		const bytes = Buffer.from(hashWithChecksum, 'hex')
		var wif = bs58.encode(bytes)
		
		//console.log("WIF: " + wif)
		
		return wif
		
	}
	
	static checkWIFChecksum(wif, testnet = false) {
		
		var bytes = bs58.decode(wif)
		var hex = bytes.toString('hex')
		
		var checksum = hex.substr(hex.length - 8).toUpperCase()
		var sub = hex.substr(0, hex.length - 8)
		
		var bits1 		= sjcl.codec.hex.toBits(sub)
		var hash1 		= sjcl.hash.sha256.hash(bits1);  
		var doubleHash  = sjcl.hash.sha256.hash(hash1); 
		var doubleHashHex = sjcl.codec.hex.fromBits(doubleHash)
		
		var calculatedChecksum = doubleHashHex.substr(0, 8).toUpperCase()
		
		if(calculatedChecksum == checksum) {
			return true
		}
		else {
			return false
		}
		
	}
	
	static generatePublicKeyFromPrivateKey(privateKey) {
		
		console.log("Public")
		//var eccPrivateKey = new sjcl.ecc.secretKey()
		console.log(sjcl.ecc.ecdsa.secretKey)
		var keys = sjcl.ecc.ecdsa.generateKeys(sjcl.ecc.curves.k256)
		console.log(keys)
		console.log(sjcl.codec.hex.fromBits(keys.sec.get()))
		console.log(sjcl.codec.hex.fromBits(keys.pub.get().x))
		console.log(sjcl.codec.hex.fromBits(keys.pub.get().y))
		
		
		
	}
	
	static generateAddress() {
		
	}
	
}