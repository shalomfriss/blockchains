import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import crypto from 'crypto';
import bs58 from 'bs58';
import { CryptoUtil } from './../crypto/CryptoUtil';
import { KeyGenerator } from './../crypto/KeyGenerator';

export class Bip32 {
	
	static HIGH_BIT = "80000000"
	
	static MAINNET_PUBLIC 	= "0488B21E"
	static MAINNET_PRIVATE 	= "0488ADE4"
	static TESTNET_PUBLIC 	= "043587CF"
	static TESTNET_PRIVATE 	= "04358394"
	
	/**
		Create a master node from a seed.  This returns an object containing the master private key (m) the master chain code (c) 
		and the master public key (M)
		@param seed - The seed to use in hex
		@return Object - {m: 'master private key', M: 'master public key', c: 'master chain code}	
	*/
	static createMasterKeys(seed) {
		 
		 if(seed.length < 16 || seed.length > 128 || CryptoUtil.isHex(seed) === false)
		 {
			console.log("ERROR: Seed must be a hex string that is 128 to 512 bits long") 
			return	 
		 }
		
		
		var hmacKey = 'Bitcoin seed'
		
		//Take a sha512 hmac of the seed
		var hmac = crypto.createHmac('SHA512', hmacKey);
		hmac.update(seed, "hex");
		var digest = hmac.digest('hex')
		
		//Split the digest into two parts 
		var masterPrivateKey = digest.substr(0, 64) 
		var masterChainCode = digest.substr(64, digest.length) 
		
		
		//Calc compressed pub key
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(masterPrivateKey)
		var privateKey = Bip32.serializeKey(Bip32.MAINNET_PRIVATE, "00", "00000000", "00000000", masterChainCode, masterPrivateKey)
		var publicKey = Bip32.serializeKey(Bip32.MAINNET_PUBLIC, "00", "00000000", "00000000", masterChainCode, compressedPublicKey)
		
		return {m: privateKey, M: publicKey, c:masterChainCode}
		
		
		
		/*
		//Calculate the master public key  
		var theNumber = new sjcl.bn("0x" + masterPrivateKey) 
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
		var masterPublicKey = {x:xhex, y:yhex} 
		*/
		
		
	}
	
	
	/**
		Derive a Bip32 private child key from a private parent key
		@param parentPrivateKey - The parent private key (xprv...)
		@param parentChainCode - The parent chain code
		@param childIndex - The child index.  If a number less than 2^31 is given, 2^31 will be added to the number	
	*/
	static derivePrivateChildKey(parentPrivateKey, parentChaincode, childIndex) {
		
		console.log("DERIVE ************")
		
		
		//Check for hardened key
		var indexNumber = new sjcl.bn("0x" + childIndex)
		var limit = new sjcl.bn("0x" + Bip32.HIGH_BIT)
		var hardened = false
		if(indexNumber.greaterEquals(limit)) {
			console.log("Must create hardened child keys")
			hardened = true
			//return
		}
		
		var key = Bip32.unserializeKey(parentPrivateKey)
		if(key.isPrivate == false) {
			console.log("***ERROR: MUST HAVE PRIVATE KEY")
			return
		}
		
		
		//Private key minus the checksum
		var privateKey = key.key.substr(0, 64)
		
		var keyStr = ""
		if(hardened == true) {
			keyStr = "00" + privateKey + childIndex
		}
		else {
			keyStr = KeyGenerator.generateCompressedBitcoinPublicKey(privateKey) + childIndex
		}
		
		//Create the hmac digest
		var hmac = crypto.createHmac('SHA512',new Buffer(parentChaincode, 'hex') )
		hmac.update(keyStr, "hex");
		var digest = hmac.digest('hex')
		
		//Take the left and right sides
		var IL = digest.substr(0, 64) 
		var chainCode = digest.substr(64, digest.length) 
		console.log("IL.      : " + IL)
		console.log("chainCode: " + chainCode)
		
		
		
		
		
		//The returned child key ki is parse256(IL) + kpar (mod n).
		var ILBN = new sjcl.bn("0x" + IL)
		var privateKeyBN = new sjcl.bn("0x" + privateKey)
		
		//This is an undocumented feature of sjcl
		console.log("G: " + sjcl.ecc.curves.k256.G)
		
		var G = sjcl.ecc.curves.k256.G
		var Gx = G.x.limbs
		var Gy = G.y.limbs
		
		console.log("X: " + sjcl.codec.hex.fromBits(Gx))
		console.log("Y: " + sjcl.codec.hex.fromBits(Gy))
		
		
		//var parentMod = privateKeyBN.mod(sjcl.ecc.curves.k256.G)
		//console.log(parentMod)
		//var total = ILBN.add(parentMod)
		var total = ILBN.add(privateKeyBN)
		var newKeyBits = total.toBits()
		var newKeyHex = sjcl.codec.hex.fromBits(newKeyBits)
		
		console.log("OUT!: " + newKeyHex)
		
		/*
		var zero = new sjcl.bn("0x0")
		if(privateNumber.greaterEquals(limit) || total.equals(zero)) {
			console.log("Invalid key: Please continue by using the next index")
			return
		}
		*/
		
				
		//Create public key along with identifier and fingerprint
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(privateKey)
		var fingerprint = Bip32.getFingerprint(privateKey)
		
		var depth = "01"
		var privateKey = Bip32.serializeKey(Bip32.MAINNET_PRIVATE, depth, fingerprint, childIndex, chainCode, newKeyHex)
		//var privateKey = Bip32.serializeKey(Bip32.MAINNET_PRIVATE, "00", "00000000", "00000000", chainCode, newKeyHex)
		
		var publicKey = Bip32.serializeKey(Bip32.MAINNET_PUBLIC, depth, fingerprint, childIndex, chainCode, compressedPublicKey)
		console.log("PUB KEY: " + publicKey)
		
		//return privateKey
		
		return {m: privateKey, M: publicKey, c:chainCode}
		
	}
	
	
	/**
		Derive a Bip32 private child key from a private parent key
		@param parentPrivateKey - The parent private key (xprv...)
		@param parentChainCode - The parent chain code
		@param childIndex - The child index.  If a number less than 2^31 is given, 2^31 will be added to the number	
	*/
	static derivePublicChildkey(parentPublicKey) {
		
	}
	
	static derivePublicChildKeyFromPrivate() {
		
	}
	
	/**
		Get the fingerprint of an extended key.  Extended keys can be identified by the Hash160 (RIPEMD160 after SHA256) of the serialized ECDSA public key K, ignoring the chain code
		@param serializedPublicKey - The serialized ECDSA public key K 
	*/
	static getIdentifier(privateKey) {
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(privateKey)
		
		var bits = sjcl.codec.hex.toBits(compressedPublicKey.toLowerCase())
		var hash1 = sjcl.hash.sha256.hash(bits);
		var hash2 = sjcl.hash.ripemd160.hash(hash1)
		var identifier = sjcl.codec.hex.fromBits(hash2)
		
		return identifier
	}
	
	/**
		Get the fingerprint of an extended key.  Extended keys can be identified by the Hash160 (RIPEMD160 after SHA256) of the serialized ECDSA public key K, ignoring the chain code
		@param serializedPublicKey - The serialized ECDSA public key K 
	*/
	static getFingerprint(privateKey) {
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(privateKey)
		
		var bits = sjcl.codec.hex.toBits(compressedPublicKey.toLowerCase())
		var hash1 = sjcl.hash.sha256.hash(bits);
		var hash2 = sjcl.hash.ripemd160.hash(hash1)
		var identifier = sjcl.codec.hex.fromBits(hash2)
		var fingerprint = identifier.substr(0, 8)
		
		return fingerprint
	}
	
	/**
		Serialize a key based on the Bip32 standard.  This uses hex strings as input.  Ex: "04FF90" no 0x in the beginning
		@param network - 4 byte: A hex string containing the version to encode (MAINNET_PUBLIC, MAINNET_PRIVATE, TESTNET_PUBLIC, TESTNET_PRIVATE)
		@param depth - 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 derived keys, ....
		@param parentFingerprint - 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
		@param childNumber - 4 bytes: This is ser32(i) for i in xi = xpar/i, with xi the key being serialized. (0x00000000 if master key)
		@param chainCode - 32 bytes: the chain code
		@param key - 33 bytes: the public key or private key data (serP(K) for public keys, 0x00 || ser256(k) for private keys)
	*/
	static serializeKey(network, depth, parentFingerprint, childNumber, chainCode, key) {
		if(network.length !== 8 || depth.length !== 2 || parentFingerprint.length !== 8 || childNumber.length !== 8 || chainCode.length !== 64)
		{
			console.log("ERROR: One of the entries is no the right length")
			console.log("network - 4 byte")
			console.log("depth - 1 byte")
			console.log("parentFingerprint - 4 bytes")
			console.log("childNumber - 4 bytes")
			console.log("chainCode - 32 bytes")
			console.log("key - 33 bytes")
			return 
		}
		
		if(network === Bip32.MAINNET_PRIVATE || network === Bip32.TESTNET_PRIVATE) {
			key = "00" + key	
		}
		
		var keyString = network + depth + parentFingerprint + childNumber + chainCode + key
		var checksum = CryptoUtil.getChecksum32(keyString)
		keyString = keyString + checksum
		var bytes = Buffer.from(keyString, 'hex')
		return bs58.encode(bytes)
	}
	
	
	static unserializeKey(theKey) {
		var dec = bs58.decode(theKey).toString("hex")
		console.log(dec)
		var key = {}
		key.network = dec.substr(0, 8)
		key.depth = dec.substr(8, 2)
		key.parentFingerprint = dec.substr(10, 8)
		key.childNumber = dec.substr(18, 8)
		key.chainCode = dec.substr(26, 64)
		key.key = dec.substr(90)
		if(theKey.indexOf("xprv") != -1 || theKey.indexOf("tprv") != -1)
		{
			key.key = key.key.substr(2)
			key.isPrivate = true
		}
		else {
			key.isPrivate = false
		}
		return key
	}
	
	
}