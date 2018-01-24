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
		
		return subs2.toUpperCase()
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
			privateKeyAndVersion = "ef" + privateKey.toUpperCase()
		}
		else { //mainnet 
			privateKeyAndVersion = "80" + privateKey.toUpperCase()
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
		
		if(calculatedChecksum === checksum) {
			return true 
		}
		else {
			return false
		}
		
	}
	
	static generatePublicKey(privateKey) {
		
		/*
		var keys = sjcl.ecc.ecdsa.generateKeys(sjcl.ecc.curves.k256)
		console.log(sjcl.codec.hex.fromBits(keys.sec.get()))
		console.log(sjcl.codec.hex.fromBits(keys.pub.get().x))
		console.log(sjcl.codec.hex.fromBits(keys.pub.get().y))
		*/
		
		//1E99423A4ED27608A15A2616A2B0E9E52CED330AC530EDCC32C8FFC6A526AEDD
		
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
				
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
				
		return {x: xhex.toString().toUpperCase(), y: yhex.toString().toUpperCase()}
	}
	
	static generateBitcoinPublicKey(privateKey) {
		
		
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
				
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
		
		var pubKey = "04" + xhex.toString().toUpperCase() + yhex.toString().toUpperCase()
		return pubKey
	}
	
	static generateCompressedBitcoinPublicKey(privateKey) {
		
		
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
				
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
		
		var pubKey = prefix + xhex.toString().toUpperCase()
		return pubKey
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
	
	
}