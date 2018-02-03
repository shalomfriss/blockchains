import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import Words from './wordlist.json';
import crypto from 'crypto';
import bs58 from 'bs58';
import { KeyGenerator } from './../crypto/KeyGenerator';
import { Bip39 } from './../bip/Bip39';

export class WalletUtil {
	
	
	/**
		Create a set of keys from a seed.  This returns an object containing the master private key (m) the master chain code (c) 
		and the master public key (K)
		@param seed - The seed to use
		@return Object - {m: 'master private key', c: 'master chain code', K: 'master public key'}	
	*/
	static createKeysFromSeed(seed) {
		
		//Create a sha512 hash.. no real secret is used here 
		var hmac = crypto.createHmac('sha512', '');
		hmac.update(seed);
		var digest = hmac.digest('hex')
		console.log("KEYS")
		console.log(digest);
		var masterPrivateKey = digest.substr(0, 64) 
		var masterChainCode = digest.substr(64, digest.length) 
		
		console.log("Master private and Master chain code")
		console.log(masterPrivateKey)
		console.log(masterChainCode)
		
		
		
		var theNumber = new sjcl.bn("0x" + masterPrivateKey)
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
		
		var masterPublicKey = {x:xhex, y:yhex}
		//var pubKey = "04" + xhex.toString().toUpperCase() + yhex.toString().toUpperCase()
		//console.log(pubKey.length)
		
		return {m: masterPrivateKey, c: masterChainCode, K: masterPublicKey}
	}
	
	
	/**
		*ON HOLD
		Derive a child key.  
		@param parentPublicKey - The coordinate pair of the ECC multiplication of the private key by G
		@param parentChainCode - The parent chain code to use
		@param index - The index of the child to generate.  index < 2^31 corresponds to non hardened  2^31 =< index < 2^32 corresponds 
						to hardened.  The format of this index is a hex string so as to accomodate large numbers.
						2^31 = 0x80000000
						2^32 = 0x100000000
	*/
	static deriveChildKey(parentPublicKey, parentChainCode, index) {
		
		var theIndex = new sjcl.bn("0x" + index)
		var limit = new sjcl.bn("0x100000000")
		var hardened = false
		
		if(theIndex.greaterEquals(limit)) {
			hardened = true
		}
		
	}
	
	/**
		Derive a child key.  
		@param parentPublicKey - The coordinate pair of the ECC multiplication of the private key by G
		@param parentChainCode - The parent chain code to use
		@param index - The index of the child to generate.  index < 2^31 corresponds to non hardened  2^31 =< index < 2^32 corresponds 
						to hardened.  The format of this index is a hex string so as to accomodate large numbers.
						2^31 = 0x80000000
						2^32 = 0x100000000
	*/
	static privateChildKeyFromPrivateParentKey(privateParentKey, parentChainCode, index) {
		var theIndex = new sjcl.bn("0x" + index)
		var limit = new sjcl.bn("0x100000000")
		var hardened = false
		
		if(theIndex.greaterEquals(limit)) {
			hardened = true
		}
		
		var str = ''
		var hmac = crypto.createHmac('sha512', parentChainCode);
		
		if(hardened === true) {
			str = '0x00' + privateParentKey + index
		}
		else {
			var pkey = KeyGenerator.generateCompressedBitcoinPublicKey(privateParentKey)
			console.log("PUB")
			console.log(pkey)
			str = pkey + index
		}
		
		hmac.update(str)
		var digest = hmac.digest('hex')
		console.log("Step 1")
		console.log(digest)
			
	}
	
	
	
}