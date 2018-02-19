import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import crypto from 'crypto';
import bs58 from 'bs58';
import { CryptoUtil } from './../crypto/CryptoUtil';
import { KeyGenerator } from './../crypto/KeyGenerator';

export class Bip32 {
	
	static HIGH_BIT = 0x80000000
	
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
		
		/*
		//Calculate the master public key  
		var theNumber = new sjcl.bn("0x" + masterPrivateKey) 
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
		var masterPublicKey = {x:xhex, y:yhex} 
		*/
		
		//Calc compressed pub key
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(masterPrivateKey)
				
		//Encode the private key
		var privateKeyString = "0488ade4" + "00" + "00000000" + "00000000" + masterChainCode + "00" + masterPrivateKey
		var checksum = CryptoUtil.getChecksum32(privateKeyString) 
		privateKeyString = privateKeyString + checksum
		var bytes = Buffer.from(privateKeyString, 'hex')
		var encodedPrivateKey = bs58.encode(bytes)
		
		//Encode the public key
		var publicKeyString = "0488b21e" + "00" + "00000000" + "00000000" + masterChainCode + compressedPublicKey
		var publicChecksum = CryptoUtil.getChecksum32(publicKeyString)
		publicKeyString = publicKeyString + publicChecksum
		bytes = Buffer.from(publicKeyString, 'hex')
		var encodedPublicKey = bs58.encode(bytes)
		
		return {m: encodedPrivateKey, M: encodedPublicKey, c:masterChainCode}
	}
}