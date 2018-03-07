import bs58 from 'bs58';

//Hack to get the sjcl modules to load correctly
import {sjcl} from './LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import { CryptoUtil } from './CryptoUtil';

export class KeyGenerator {
	
	/** 
		Generate a Bitcoin compliant private key.  
		@return privateKey - A hex number that is between 1 and 2^256
	*/
	static generatePrivateKey() {
		
		var ecdsa = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140"
		var limit = new sjcl.bn(ecdsa)
		
		var privateKey = CryptoUtil.getRandomNumber()
		
		var theNumber = new sjcl.bn("0x" + privateKey)
		while(theNumber.greaterEquals(limit) !== 0)
		{
			privateKey = CryptoUtil.getRandomNumber()
			theNumber = new sjcl.bn("0x" + privateKey)
		}
		return privateKey		
	}
	
	static generateHexCompressedPrivateKey() {
		
		var key = KeyGenerator.generatePrivateKey()
		var privateKey = key + "01"
		return privateKey		
	}
	
	/**
		Get a private key from a wif	
	*/
	static privateKeyFromWIF(wif) {
		
		//Convert from base58
		var bytes = bs58.decode(wif)
		var hex = bytes.toString('hex')
		
		var subs = hex.substr(0, hex.length - 8)
		var subs2 = subs.substr(2, hex.length)
		
		return subs2
	}
	
	static wifCompressedFromPrivateKey(privateKey, testnet = false) {
		var key = KeyGenerator.wifFromPrivateKey(privateKey, testnet, true)
		return key
	}
	
	static wifFromPrivateKey(privateKey, testnet = false, compressed = false) {
		
		
		//privateKey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
		//testnet = false
		
		//console.log("Private key: " + privateKey)
		
		
		//Add WIF prefix
		//testnet / regtest
		var privateKeyAndVersion = "";
		if(testnet === true) {
			privateKeyAndVersion = "ef" + privateKey
		}
		else { //mainnet 
			privateKeyAndVersion = "80" + privateKey
		}
		
		if(compressed === true) {
			privateKeyAndVersion += "01"
		}
		//console.log("Private key with prefix: " + privateKeyAndVersion)
		
		
		var bits1 =  sjcl.codec.hex.toBits(privateKeyAndVersion)
		var hash1 = sjcl.hash.sha256.hash(bits1);  
		//console.log("HASH1: " + sjcl.codec.hex.fromBits(hash1))
		
		
		var doubleHash  = sjcl.hash.sha256.hash(hash1); 
		doubleHash = sjcl.codec.hex.fromBits(doubleHash); 
		//console.log("HASH2: " + doubleHash)
		
		var checksum = doubleHash.substr(0, 8)
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
		
		var checksum = hex.substr(hex.length - 8)
		var sub = hex.substr(0, hex.length - 8)
		
		var bits1 		= sjcl.codec.hex.toBits(sub)
		var hash1 		= sjcl.hash.sha256.hash(bits1);  
		var doubleHash  = sjcl.hash.sha256.hash(hash1); 
		var doubleHashHex = sjcl.codec.hex.fromBits(doubleHash)
		
		var calculatedChecksum = doubleHashHex.substr(0, 8)
		
		if(calculatedChecksum === checksum) {
			return true 
		}
		else {
			return false
		}
		
	}
	
	static generateRawPublicKey(privateKey) {
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
		return K
	}
	
	static generatePublicKey(privateKey) {
				
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
				
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
				
		return {x: xhex.toString(), y: yhex.toString()}
	}
	
	static generateBitcoinPublicKey(privateKey) {
		
		
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
				
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
		
		var pubKey = "04" + xhex.toString() + yhex.toString()
		return pubKey
	}
	
	static compressRawPublicKey(K) {
		
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
		
		var yCoord = new sjcl.bn("0x" + yhex)
		
		var ystr = yCoord.toString()
		var lastChar = ystr.charAt(ystr.length - 1).toUpperCase()
		
		var prefix = ""
		if(lastChar === "0" || lastChar === "2" || lastChar === "4" || lastChar === "6" || 
		lastChar === "8" || lastChar === "A" || lastChar === "C" || lastChar === "E") 
		{
			prefix = "02"
		}
		else
		{
			prefix = "03"
		}
		
		var pubKey = prefix + xhex.toString()
		return pubKey
	}
	
	/**
		Generate a compressed bitcoin public key from a private key
		@param privateKey - The private key in hex	
	*/
	static generateCompressedBitcoinPublicKey(privateKey) {
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
		
		return KeyGenerator.compressRawPublicKey(K)
	}
	
	
	static generateBitcoinAddressFromPrivateKey(privateKey) {
		var publicKey = KeyGenerator.generateBitcoinPublicKey(privateKey)
		var address = KeyGenerator.generateBitcoinAddressFromPublicKey(publicKey)
		return address
	}
	
	static generateBitcoinAddressFromPublicKey(publicKey) {
		
		var bits = sjcl.codec.hex.toBits(publicKey)
		var hash1 = sjcl.hash.sha256.hash(bits);
		var hash2 = sjcl.hash.ripemd160.hash(hash1)
		var btc = "00" + sjcl.codec.hex.fromBits(hash2)
		
		bits = sjcl.codec.hex.toBits("0x" + btc)
		hash1 = sjcl.hash.sha256.hash(bits);
		hash1 = sjcl.hash.sha256.hash(hash1);
		var doubleHash = sjcl.codec.hex.fromBits(hash1)
		
		var checksum = doubleHash.substr(0, 8)
		btc = btc + checksum
		
		const bytes = Buffer.from(btc, 'hex')
		var address = bs58.encode(bytes)
		return address
		
	}
	
	static generateBitcoinAddress() {
		var privateKey = KeyGenerator.generatePrivateKey()
		var publicKey = KeyGenerator.generateBitcoinPublicKey(privateKey)
		var address = KeyGenerator.generateBitcoinAddressFromPublicKey(publicKey)
		return address
	}
	
	
	/**
		NOT WORKING	
	*/
	/*
	static decompressPublicKey(key) {
		console.log(key)
		
		//Now we recover the point that generated this key
		//we have y but not x. the curve is y^2 = x^3 + 7
		//so we need pow(y^2 - 7, 1/3)
		
		//console.log(sjcl.ecc.ecdsa.generateKeys(sjcl.ecc.curves.k256))
		var p = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"
		//console.log("INT: " + parseInt(p, 16))
		var x = key.substring(2, key.length)
		console.log("x: " + x)
		
		var pbn = new sjcl.bn("0x" + p)
		
		var xbn = new sjcl.bn("0x" + x)
		var temp = xbn.power(2)
		temp = temp.mod(pbn)
		temp = temp.sub(7)
		temp = temp.mod(pbn)
		//console.log(temp.toString)
		
		var test = new sjcl.bn("0x10")
		//test = test.power(0.5)
		console.log(test.toString())
		//Now we recover the point that generated this key
		//we have y but not x. the curve is y^2 = x^3 + 7
		//so we need pow(y^2 - 7, 1/3)
		
		//temp.power(pbn)
		
		console.log(temp.toString())		
	}
	*/
}