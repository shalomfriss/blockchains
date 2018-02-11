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
		@param seed - The seed to use
		@return Object - {m: 'master private key', c: 'master chain code', M: 'master public key'}	
	*/
	static createMasterNode(seed) {
		 
		 console.log("START --------------------------------")
		 console.log("SEED: " + seed)
		 
		 //Take a sha512 hmac of the seed
		var hmac = crypto.createHmac('sha512', '');
		hmac.update(seed);
		var digest = hmac.digest('hex')
		
		//console.log("DIGEST: " + digest)
		
		//Split the digest into two parts
		var masterPrivateKey = digest.substr(0, 64) 
		var masterChainCode = digest.substr(64, digest.length) 
		
		console.log("MASTER PRIVATE KEY: " + masterPrivateKey)
		console.log("MASTER CHAIN CODE: " + masterChainCode)
		
		//Calculate the master public key  
		var theNumber = new sjcl.bn("0x" + masterPrivateKey) 
		var K = sjcl.ecc.curves.k256.G.mult(theNumber)
		var xhex = sjcl.codec.hex.fromBits(K.x.toBits())
		var yhex = sjcl.codec.hex.fromBits(K.y.toBits())
		var masterPublicKey = {x:xhex, y:yhex}
		
		var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(masterPrivateKey)
		console.log("COMPRESSED PUBLIC KEY: " + compressedPublicKey)
				
		
		
		//Create base58 check representation of a compressed private key (01 added to the end)
		var b58Private = "80" + masterPrivateKey + "01"
		var b58PrivateChecksum =  CryptoUtil.getChecksum32(b58Private) 
		b58Private = b58Private + b58PrivateChecksum
		var bytes = Buffer.from(b58Private, 'hex')
		var b58CompressedPrivateKey = bs58.encode(bytes)
		console.log("BITCOIN PRIVATE KEY ENCODED: " + b58CompressedPrivateKey)
		
		
		//Encode the private key
		var str = "0488ADE4" + "00" + "00000000" + "00000000" + masterChainCode + "00" + masterPrivateKey
		var checksum = CryptoUtil.getChecksum32(str) 
		str = str + checksum
		var bytes = Buffer.from(str, 'hex')
		var enc = bs58.encode(bytes)
		console.log("--PRIVATE KEY ENCODED: " + enc + " - " + enc.length)
		
		
		//Public key creation - xpub661MyMwAqRbcGdRF7Aa79CJLzUM6gw7jd3knnCZJfqb6oWaC598xgV96feHqKUWxjXQ6yUYaZW4yMaCKyCYYz2V5xJaB6X6E6AYxxreDeUD
		var publicStr = "0488B21E" + "00" + "00000000" + "00000000" + masterChainCode + compressedPublicKey
		var publicChecksum = CryptoUtil.getChecksum32(publicStr)
		publicStr = publicStr + publicChecksum
		bytes = Buffer.from(publicStr, 'hex')
		enc = bs58.encode(bytes)
		console.log("--PUBLIC KEY ENCODED: " + enc + " - " + enc.length)
		
		return {m: masterPrivateKey, c: masterChainCode, M: masterPublicKey}
		
	}
}