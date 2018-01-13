import bigInt from 'big-integer';
import sha256 from 'js-sha256';
import bs58 from 'bs58';
import sjcl from 'sjcl';

export class KeyGenerator {
	
	/**
		Generate a private key for Bitcoin
	*/
	static generatePrivateKey() {
		
		
		/*
		var randArr = new Uint8Array(32) //create a typed array of 32 bytes (256 bits)
		window.crypto.getRandomValues(randArr)
		
		var privateKeyBytes = []
		for (var i = 0; i < randArr.length; ++i) {
		  privateKeyBytes[i] = randArr[i]
		}
		*/
		
		//var privateKeyHex = Crypto.util.bytesToHex(privateKeyBytes).toUpperCase()
		//console.log(privateKeyHex)
		
		//console.log("RAND")
		//console.log(privateKeyBytes)
		
		
		//Calculate upper limit
		var b1 = bigInt(2).pow(256)
		b1 = b1.minus(1)
		
		//Generate large random
		var rando = bigInt.randBetween(0, b1)
		
		//Create SHA256 hash
		var hash = sha256.create();
		hash.update(rando.toString(16))
		
		//Check that the sha256 of the generated number is less than 2^256 - 1
		var newInt = bigInt(b1.toString(), 16)
		while(newInt.greaterOrEquals(b1)) 
		{
			var rando = bigInt.randBetween(1, b1)
			
			var hash = sha256.create();
			hash.update(rando.toString(16))
			
			var newInt = bigInt(hash.hex(), 16)
		}
		
		return newInt.toString(16)
		
	}
	
	
	
	static generatePrivateKeyWIF(privateKey, testnet = false) {
		
		
		privateKey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
		testnet = false
		
		console.log("Private key: " + privateKey)
		
		
		//Add WIF prefix
		//testnet / regtest
		var privateKeyAndVersion = "";
		if(testnet == true) {
			privateKeyAndVersion = "ef" + privateKey
		}
		else { //mainnet 
			privateKeyAndVersion = "80" + privateKey
		}
		
		console.log("Private key with prefix: " + privateKeyAndVersion)
		
		
		var bits1 =  sjcl.codec.hex.toBits(privateKeyAndVersion)
		var hash1 = sjcl.hash.sha256.hash(bits1);  
		console.log("HASH1: " + sjcl.codec.hex.fromBits(hash1))
		
		
		var doubleHash  = sjcl.hash.sha256.hash(hash1); 
		doubleHash = sjcl.codec.hex.fromBits(doubleHash); 
		console.log("HASH2: " + doubleHash)
		
		var checksum = doubleHash.substr(0, 8).toUpperCase()
		console.log("Checksum: " + checksum)
		
		//Add to current result
		var hashWithChecksum = privateKeyAndVersion + checksum
		console.log("Hash With checksum added: " + hashWithChecksum)
		
		//Encode to base58
		const bytes = Buffer.from(hashWithChecksum, 'hex')
		var wif = bs58.encode(bytes)
		
		console.log("WIF: " + wif)
		
		return wif

		
	}
	
	static generatePublicKey() {
		
	}
	
}