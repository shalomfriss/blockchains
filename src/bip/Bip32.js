import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/codecBytes'; 
import 'sjcl/core/ripemd160';
import crypto from 'crypto';
import bs58 from 'bs58';
import { CryptoUtil } from './../crypto/CryptoUtil';
import { KeyGenerator } from './../crypto/KeyGenerator';
import { Bip32Key } from './Bip32Key';

export class Bip32 {
	
	static HIGH_BIT = "80000000"
	
	static MAINNET_PUBLIC 	= "0488B21E"
	static MAINNET_PRIVATE 	= "0488ADE4"
	static TESTNET_PUBLIC 	= "043587CF"
	static TESTNET_PRIVATE 	= "04358394"
	
	//https://eng.paxos.com/blockchain-101-elliptic-curve-cryptography
	static SECP256K1_ORDER = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
	
	
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
		
		//Make sure the key is valid
		var zeroBN = new sjcl.bn("0x00")
		var sOrder = new sjcl.bn("0x" + Bip32.SECP256K1_ORDER)
		var masterPrivateKeyBN = new sjcl.bn("0x" + masterPrivateKey)
		if(masterPrivateKeyBN.equals(zeroBN) || masterPrivateKeyBN.greaterEquals(sOrder)) {
			console.log("ERROR: An invalid key was generated")
			return null
		}
		
		//Calc compressed pub key
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(masterPrivateKey)
		var privateKey = Bip32.serializeKey(Bip32.MAINNET_PRIVATE, "00", "00000000", "00000000", masterChainCode, masterPrivateKey)
		var publicKey = Bip32.serializeKey(Bip32.MAINNET_PUBLIC, "00", "00000000", "00000000", masterChainCode, compressedPublicKey)
		
		var masterPrivateKey = new Bip32Key()
		masterPrivateKey.network 		= Bip32.MAINNET_PRIVATE
		masterPrivateKey.depth 			= "00"
		masterPrivateKey.fingerprint 	= "00000000"
		masterPrivateKey.index 			= "00000000"
		masterPrivateKey.chainCode 		= masterChainCode
		masterPrivateKey.key 			= masterPrivateKey
		masterPrivateKey.isPrivate		= true
		
		var masterPublicKey = new Bip32Key()
		masterPublicKey.network 		= Bip32.MAINNET_PUBLIC
		masterPublicKey.depth 			= "00"
		masterPublicKey.fingerprint 	= "00000000"
		masterPublicKey.index 			= "00000000"
		masterPublicKey.chainCode 		= masterChainCode
		masterPublicKey.key 			= compressedPublicKey
		masterPublicKey.isPrivate		= false
		
		return {m: privateKey, M: publicKey, c:masterChainCode}
		
	}
	
	
	
	
	/**
		Derive a Bip32 private child key from a private parent key
		@param parentPrivateKey - The parent private key (xprv...)
		@param parentChainCode - The parent chain code
		@param childIndex - The child index as an integer
	*/
	static privateChildFromPrivateParent(parentPrivateKey, parentChaincode, childIndex) {
		
		//Convert childIndex to hex and pad
		var childIndexHex = childIndex.toString(16)
		if(childIndexHex.length < 8) {
			while(childIndexHex.length < 8) {
				childIndexHex = "0" + childIndexHex
			}
		}
		
		//Check for hardened key 0x80000000 = 2147483648
		var hardened = false
		if(childIndex >= 2147483648) {hardened = true}
		
		//Check for private key
		var key = Bip32.unserializeKey(parentPrivateKey)
		if(key.isPrivate == false) {
			console.log("***ERROR: MUST HAVE PRIVATE KEY")
			return 
		}
		
		//Private key minus the checksum
		var privateKey = key.key.substr(0, 64)
		var keyStr = ""
		if(hardened == true) {
			keyStr = "00" + privateKey + childIndexHex
		}
		else {
			keyStr = KeyGenerator.generateCompressedBitcoinPublicKey(privateKey) + childIndexHex
		}
		
		//Create the hmac digest
		var hmac = crypto.createHmac('SHA512',new Buffer(parentChaincode, 'hex') )
		hmac.update(keyStr, "hex")
		var digest = hmac.digest('hex')
		
		//Take the left and right sides
		var IL = digest.substr(0, 64) 
		var chainCode = digest.substr(64, digest.length) 
		
		//Create a new private key hex
		//The returned child key ki is parse256(IL) + kpar (mod n) in hex
		var orderNBN = new sjcl.bn("0x" + Bip32.SECP256K1_ORDER)
		var ILBN = new sjcl.bn("0x" + IL)
		var privateKeyBN = new sjcl.bn("0x" + privateKey)
		var total = ILBN.add(privateKeyBN)
		//mod is an undocumented feature of sjcl
		total = total.mod(orderNBN)
		var newKeyBits = total.toBits()
		var newKeyHex = sjcl.codec.hex.fromBits(newKeyBits)
		
		//In case parse256(IL) ≥ n or ki = 0, the resulting key is invalid
		var newKeyBN = new sjcl.bn("0x" + newKeyHex)
		var nBN = new sjcl.bn("0x" + Bip32.SECP256K1_ORDER)
		var zeroBN = new sjcl.bn("0x0")
		if(ILBN.greaterEquals(nBN) || newKeyBN.equals(zeroBN))
		{
			console.log("ERROR: Invalid key generated, continued with the next child index of " + (childIndex + 1))
			return Bip32.privateChildFromPrivateParent(parentPrivateKey, parentChaincode, childIndex + 1)	
		}
		
		//Create the parent fingerprint
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(newKeyHex)
		var parentFingerprint = Bip32.getFingerprint(privateKey)
		
		//calculate the new depth
		var depth = parseInt(key.depth, 16)
		depth += 1
		depth = depth.toString(16)
		depth = depth.length < 2 ? "0" + depth : depth
		
		var privateKey = Bip32.serializeKey(Bip32.MAINNET_PRIVATE, depth, parentFingerprint, childIndexHex, chainCode, newKeyHex)
		var publicKey = Bip32.serializeKey(Bip32.MAINNET_PUBLIC, depth, parentFingerprint, childIndexHex, chainCode, compressedPublicKey)
		
		return {m: privateKey, M: publicKey, c:chainCode}
		
	}
	
	
	/**
		Derive a Bip32 private child key from a private parent key
		@param parentPrivateKey - The parent private key (xprv...)
		@param parentChainCode - The parent chain code
		@param childIndex - The child index.  If a number less than 2^31 is given, 2^31 will be added to the number	
	*/
	static publicChildFromPublicParent(parentPublicKey, parentChaincode, childIndex) {
		//Check for hardened key 0x80000000 = 2147483648
		var hardened = false
		if(childIndex >= 2147483648) {hardened = true}
		
		if(hardened == true) {
			console.log("ERROR: Cannot derive from hardened key")
			return
		}
	}
	
	static publicChildFromPrivateParent() {
		
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
		
		var isPrivate = true
		if(network instanceof Bip32Key) {
			var theKey 			= network
			network 			= theKey.network 		
			depth 				= theKey.depth 			
			parentFingerprint 	= theKey.fingerprint 
			childNumber 		= theKey.index 			
			chainCode 			= theKey.chainCode 		
			key 				= theKey.key 			
			isPrivate			= theKey.isPrivate		
		}
		
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