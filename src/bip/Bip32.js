import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/codecBytes'; 
import 'sjcl/core/ripemd160';
import '../vendor/sjcl-extended/src/sjcl-extramath';
import crypto from 'crypto';
import bs58 from 'bs58';
import { CryptoUtil } from './../crypto/CryptoUtil';
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
		var compressedPublicKey = Bip32.generateCompressedPublicKey(masterPrivateKey)
		var rawPublicKey = Bip32.generateRawPublicKey(masterPrivateKey)
		
		//var privateKey = Bip32.serializeKey(Bip32.MAINNET_PRIVATE, "00", "00000000", "00000000", masterChainCode, masterPrivateKey)
		//var publicKey = Bip32.serializeKey(Bip32.MAINNET_PUBLIC, "00", "00000000", "00000000", masterChainCode, compressedPublicKey)
		
		var bip32PrivateKey = new Bip32Key()
		bip32PrivateKey.network 		= Bip32.MAINNET_PRIVATE
		bip32PrivateKey.depth 			= "00"
		bip32PrivateKey.fingerprint 	= "00000000"
		bip32PrivateKey.index 			= "00000000"
		bip32PrivateKey.chainCode 		= masterChainCode
		bip32PrivateKey.key 			= masterPrivateKey
		bip32PrivateKey.isPrivate		= true
		
		var bip32PublicKey = new Bip32Key()
		bip32PublicKey.network 			= Bip32.MAINNET_PUBLIC
		bip32PublicKey.depth 			= "00"
		bip32PublicKey.fingerprint 		= "00000000"
		bip32PublicKey.index 			= "00000000"
		bip32PublicKey.chainCode 		= masterChainCode
		bip32PublicKey.key 				= compressedPublicKey
		bip32PublicKey.rawKey			= rawPublicKey
		bip32PublicKey.isPrivate		= false
		
		return {m: bip32PrivateKey, M: bip32PublicKey}
		
	}
	
	
	
	
	/**
		Derive a Bip32 private child key from a private parent key
		@param parentPrivateKey:Bip32Key - The parent private Bip32Key
		@param childIndex:Integer - The child index as an integer
	*/
	static privateChildFromPrivateParent(parentPrivateKey, childIndex) {
		
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
		if(parentPrivateKey.isPrivate == false) {
			console.log("***ERROR: MUST HAVE PRIVATE KEY")
			return 
		}
		
		//Private key minus the checksum
		var privateKey = parentPrivateKey.key.substr(0, 64)
		var keyStr = ""
		if(hardened == true) {
			keyStr = "00" + privateKey + childIndexHex
		}
		else {
			keyStr = Bip32.generateCompressedPublicKey(privateKey) + childIndexHex
		}
		
		//Create the hmac digest
		var hmac = crypto.createHmac('SHA512',new Buffer(parentPrivateKey.chainCode, 'hex') )
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
			return Bip32.privateChildFromPrivateParent(parentPrivateKey, childIndex + 1)	
		}
		
		//Create the parent fingerprint
		var parentFingerprint = Bip32.getFingerprint(parentPrivateKey)
		
		//calculate the new depth
		var depth = parseInt(parentPrivateKey.depth, 16)
		depth += 1
		depth = depth.toString(16)
		depth = depth.length < 2 ? "0" + depth : depth
		
		//var privateKey = Bip32.serializeKey(Bip32.MAINNET_PRIVATE, depth, parentFingerprint, childIndexHex, chainCode, newKeyHex)
		//var publicKey = Bip32.serializeKey(Bip32.MAINNET_PUBLIC, depth, parentFingerprint, childIndexHex, chainCode, compressedPublicKey)
		//return {m: privateKey, M: publicKey, c:chainCode, rawPublicKey: rawPublicKey}
		
		
		var bip32PrivateKey = new Bip32Key()
		bip32PrivateKey.network 		= Bip32.MAINNET_PRIVATE
		bip32PrivateKey.depth 			= depth
		bip32PrivateKey.fingerprint 	= parentFingerprint
		bip32PrivateKey.index 			= childIndexHex
		bip32PrivateKey.chainCode 		= chainCode
		bip32PrivateKey.key 			= newKeyHex
		bip32PrivateKey.isPrivate		= true
		
		return bip32PrivateKey
		
		//var bip32PublicKey = Bip32.publicKeyFromPrivateKey(bip32PrivateKey)		
		//return {m: bip32PrivateKey, M: bip32PublicKey}
		
	}
	
	
	
	/**
		Derive a Bip32 private child key from a private parent key
		@param parentPrivateKey - The parent private key (xprv...)
		@param parentChainCode - The parent chain code
		@param childIndex - The child index.  If a number less than 2^31 is given, 2^31 will be added to the number	
	*/
	static publicChildFromPublicParent(parentPublicKey, childIndex) {
		
		//Check for hardened key 0x80000000 = 2147483648
		var hardened = false
		if(childIndex >= 2147483648) {hardened = true}
		if(hardened == true) {
			console.log("ERROR: Cannot derive hardened child")
			return
		}		
		
		//Check for public key
		if(parentPublicKey.isPrivate == true) {
			console.log("***ERROR: MUST HAVE PUBLIC KEY")
			return 
		}
		
		
		//Convert childIndex to hex and pad
		var childIndexHex = childIndex.toString(16)
		if(childIndexHex.length < 8) {
			while(childIndexHex.length < 8) {
				childIndexHex = "0" + childIndexHex
			}
		}
		
		var keyStr = parentPublicKey.key + childIndexHex
		
		//Create the hmac digest
		var hmac = crypto.createHmac('SHA512',new Buffer(parentPublicKey.chainCode, 'hex') )
		hmac.update(keyStr, "hex")
		var digest = hmac.digest('hex')
		
		
		//Take the left and right sides
		var IL = digest.substr(0, 64) 
		var chainCode = digest.substr(64, digest.length) 
		
		
		// Ki = (IL + kpar)*G = IL*G + Kpar
		var ILBN = new sjcl.bn("0x" + IL)
		var ILG = sjcl.ecc.curves.k256.G.mult(ILBN)	//Affine coordinate
		
		//Create a point on the ecc curve to add 
		var P = new sjcl.ecc.point( // (curve, x, y)
			sjcl.ecc.curves.k256,
			new sjcl.bn.prime.p256k(parentPublicKey.rawKey.x.toString()),
			new sjcl.bn.prime.p256k(parentPublicKey.rawKey.y.toString())
		)
		
		//The public key
		//ILG has to be jacobian, P has to be affine, the result is Jacobian
		var KI = (ILG.toJac().add(P)).toAffine()
		
		
		var compressedPublicKey = Bip32.compressRawPublicKey(KI)
		var fingerprint = Bip32.getFingerprint(parentPublicKey.key)
		
		//In case parse256(IL) ≥ n or Ki is the point at infinity, the resulting key is invalid
		//*TODO: In case Ki is the point at infinity, the resulting key is invalid, and one should proceed with the next value for i.
		var nBN = new sjcl.bn("0x" + Bip32.SECP256K1_ORDER)
		if(ILBN.greaterEquals(nBN))
		{
			console.log("ERROR: Invalid key generated, continued with the next child index of " + (childIndex + 1))
			return Bip32.publicChildFromPublicParent(parentPublicKey, childIndex + 1)	
		}
		
		
		//calculate the new depth
		var depth = parseInt(parentPublicKey.depth, 16)
		depth += 1
		depth = depth.toString(16)
		depth = depth.length < 2 ? "0" + depth : depth
		
		
		var bip32PublicKey = new Bip32Key()
		bip32PublicKey.network 			= Bip32.MAINNET_PUBLIC
		bip32PublicKey.depth 			= depth
		bip32PublicKey.fingerprint 		= fingerprint
		bip32PublicKey.index 			= childIndexHex
		bip32PublicKey.chainCode 		= chainCode
		bip32PublicKey.key 				= compressedPublicKey
		bip32PublicKey.rawKey			= KI
		bip32PublicKey.isPrivate		= false
		return bip32PublicKey
	}
	
	static publicChildFromPrivateParent(parentPrivateKey, childIndex) {
		//Check for hardened key 0x80000000 = 2147483648
		var hardened = false
		if(childIndex >= 2147483648) {hardened = true}
		
		if(hardened === true) {
			var childPrivateKey = Bip32.privateChildFromPrivateParent(parentPrivateKey, childIndex)
			var childPublicKey = Bip32.publicKeyFromPrivateKey(childPrivateKey)
			return childPublicKey
		}
		else {
			var parentPublicKey = Bip32.publicKeyFromPrivateKey(parentPrivateKey)
			return Bip32.publicChildFromPublicParent(parentPublicKey, childIndex)
		}
		
	}
	
	//THIS IS NOT POSSIBLE
	static privateChildFromPublicParent() {
		console.log("ERROR: Deriving private child key from public parent key is not possible")
	}
	
	
	/**
		Create a public key from a private key	
		privateKey:Bip32Key - The private key
	*/
	static publicKeyFromPrivateKey(privateKey) {
		//Make sure there's no checksum
		var pKey = privateKey.key.substr(0, 64)
		
		//Create the parent fingerprint
		var compressedPublicKey = Bip32.generateCompressedPublicKey(pKey)
		var rawPublicKey 		= Bip32.generateRawPublicKey(pKey)
		
		var bip32PublicKey = new Bip32Key()
		bip32PublicKey.network 			= Bip32.MAINNET_PUBLIC
		bip32PublicKey.depth 			= privateKey.depth
		bip32PublicKey.fingerprint 		= privateKey.fingerprint
		bip32PublicKey.index 			= privateKey.index
		bip32PublicKey.chainCode 		= privateKey.chainCode
		bip32PublicKey.key 				= compressedPublicKey
		bip32PublicKey.rawKey			= rawPublicKey
		bip32PublicKey.isPrivate		= false
		
		return bip32PublicKey
	}

	/******************************************************************************************************************/
	//UTILITIES
	/******************************************************************************************************************/
	
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
	
	/**
		Generate a compressed  public key from a private key
		@param privateKey - The private key in hex	
	*/
	static generateCompressedPublicKey(privateKey) {
		var theNumber = new sjcl.bn("0x" + privateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
		
		return Bip32.compressRawPublicKey(K)
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
		Decompress a compressed public key
		@param 	publicKey - A compressed public key (hex string starting with 02 or 03)
		@return sjcl.ecc.point - 
		*TODO: Formalize based on http://www.secg.org/sec1-v2.pdf
	*/
	static decompressPublicKey(publicKey) {
		
		//Prep data
		var curve = sjcl.ecc.curves.k256
		var field_order = curve.r
		var field_modulus = curve.field.modulus
		var p = field_modulus.add(1).div(4)
		var evenodd = publicKey.substr(0, 2)
		var checkVal = evenodd == "02" ? 0 : 1
		
		var key = publicKey.substr(2, publicKey.length)
		
		//Exec ECC operations
		key = new sjcl.bn("0x" + key)
		var ysquared = key.mul(key).mul(key).add(curve.a.mul(key)).add(curve.b).mod(field_modulus);
		var y = ysquared.powermod(p, field_modulus)
		
		var check = y.limbs[0] & 1;
		
		if(check === checkVal) {
			 y = y
		}
		else {
			y = field_modulus.sub(y).normalize();
		}
		
		var keyPoint = new sjcl.ecc.point(curve, key, y);
		return keyPoint	
		
	}
	
		
	/**
		Get the fingerprint of an extended key.  Extended keys can be identified by the Hash160 (RIPEMD160 after SHA256) of the serialized ECDSA public key K, ignoring the chain code
		@param key:Bip32Key - a bip 32 key
	*/
	static getIdentifier(key) {
		var keystr = ""
		if(key instanceof Bip32Key) {
			if(key.isPrivate === true) {
				keystr = Bip32.generateCompressedPublicKey(key.key)
			}
			else
			{
				keystr = key.key
			}		
		}
		else {
			keystr = key
		}
		
		
		var bits = sjcl.codec.hex.toBits(keystr.toLowerCase())
		var hash1 = sjcl.hash.sha256.hash(bits);
		var hash2 = sjcl.hash.ripemd160.hash(hash1)
		var identifier = sjcl.codec.hex.fromBits(hash2)
		
		return identifier
	}
	
	/**
		Get the fingerprint of an extended key.  Extended keys can be identified by the Hash160 (RIPEMD160 after SHA256) of the serialized ECDSA public key K, ignoring the chain code
	*/
	static getFingerprint(key) {
		var keystr = ""
		if(key instanceof Bip32Key) {
			if(key.isPrivate === true) {
				keystr = Bip32.generateCompressedPublicKey(key.key)
			}
			else
			{
				keystr = key.key
			}		
		}
		else
		{
			keystr = key
		}
		
		
		var bits = sjcl.codec.hex.toBits(keystr.toLowerCase())
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
	
	
	/*
		validate a key that will be imported
		When importing a serialized extended public key, implementations must verify whether the X coordinate in the public key data corresponds to a point on the curve. If not, the extended public key is invalid.
		#param publicKey - a serialized extended public key
	*/
	static validatePublicKey(publicKey) {
		var unKey = Bip32.unserializeKey(publicKey)
		var dKey = Bip32.decompressPublicKey(unKey.key)
		
		
	}
	
}