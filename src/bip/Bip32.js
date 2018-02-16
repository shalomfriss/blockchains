import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import crypto from 'crypto';
import bs58 from 'bs58';
import { CryptoUtil } from './../crypto/CryptoUtil';
import { KeyGenerator } from './../crypto/KeyGenerator';
import jsSHA from 'jssha';

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
		var hmac = crypto.createHmac('SHA512', 'Bitcoin seed');
		hmac.update(seed, "hex");
		var digest = hmac.digest('hex')
		
		
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
		
		//Calc compressed pub key
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
		var str = "0488ade4" + "00" + "00000000" + "00000000" + masterChainCode + "00" + masterPrivateKey
		var checksum = CryptoUtil.getChecksum32(str) 
		str = str + checksum
		var bytes = Buffer.from(str, 'hex')
		var enc1 = bs58.encode(bytes)
		console.log("--PRIVATE KEY ENCODED: " + enc1 + " - " + enc1.length)
		
		
		var test = "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8"
		var dec1 = bs58.decode(test)
		console.log("DECODED 1: " + dec1.toString('hex'))
		//0488b21e000000000000000000
		//873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508
		//0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2
		//ab473b21
		
		
		//be5badd2e1fa21e07d888d94690ba40b8925127e716cb997daf1879fe96fce08
		
		//Mine decoded
		//0488b21e000000000000000000
		//0bb44f25c5c90bc2aff51bc70e7d9b38ad7cefe00723baea8627d9a199f84d0a
		//03390b552177f0847ad0cbaf1faeeeb90b47f6716bc0b3ea4319e71067bde02b9a
		//fe42fae6
		
		//xpub661MyMwAqRbcEfC95gxBgUisDZdSDQj6LBCaE3c5yEP3Kv8jrqm8ks5RPzMCt2XmvSxQChuDz3tq3bdp8kxQx29uenX4cHePYVEactuAFrD
		
		//be5badd2e1fa21e07d888d94690ba40b8925127e716cb997daf1879fe96fce08
		//Public key creation - xpub661MyMwAqRbcGdRF7Aa79CJLzUM6gw7jd3knnCZJfqb6oWaC598xgV96feHqKUWxjXQ6yUYaZW4yMaCKyCYYz2V5xJaB6X6E6AYxxreDeUD
		var publicStr = "0488b21e" + "00" + "00000000" + "00000000" + masterChainCode + compressedPublicKey
		
		var publicChecksum = CryptoUtil.getChecksum32(publicStr)
		publicStr = publicStr + publicChecksum
		console.log("STR: " + publicStr)
		bytes = Buffer.from(publicStr, 'hex')
		var enc = bs58.encode(bytes)
		console.log("--PUBLIC KEY ENCODED: " + enc + " - " + enc.length)
		
		
		//return {m: masterPrivateKey, c: masterChainCode, M: masterPublicKey}
		return {m: enc1, M: enc}
		
		
	}
}