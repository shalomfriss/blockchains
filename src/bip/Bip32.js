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
		
		console.log("DIGEST: " + digest)
		
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
		//var pubKey = "04" + xhex.toString().toUpperCase() + yhex.toString().toUpperCase()
		//console.log(pubKey.length)
		
		//d183ed778d32b4fceced902dd94340e22d92e94dc7b068243e5403ac40d547f5
		//054148083e6492bdefb8c7f42cd2d51246c654a50e6ae8a1cc9245e42cfaea22
		
		//console.log("BASE64: " + CryptoUtil.base64(masterPrivateKey))
		var bytes = Buffer.from(masterPrivateKey, 'hex')
		var enc = bs58.encode(bytes)
		console.log("PRIVATE KEY ENC: " + enc + " - " + enc.length)
		var masterPrivateKeyEncoded = enc
		
		
		var hex1 = bs58.decode("L1tyegF2Mt8WGriKvDXm6THgKCnTjcRR2CnMah3YP6UFaNvrSd6d")
		console.log("DECODED: " + hex1.toString('hex'))
		
		//808b8cc2498950fd67d7671cd9fe17d2f2ad2e7b3d79d8fc1d99f8f33d356af187010b54a02e
		//8b8cc2498950fd67d7671cd9fe17d2f2ad2e7b3d79d8fc1d99f8f33d356af187
		
		//L1tyegF2Mt8WGriKvDXm6THgKCnTjcRR2CnMah3YP6UFaNvrSd6d
		
		//Create the bip32 string and the base58 representation
		var str = "0488ADE4" + "00" + "00000000" + "00000000" + masterChainCode + "00" + masterPrivateKey
		//var str = "0488ADE4" + "00" + "00000000" + "00000000" + "054148083e6492bdefb8c7f42cd2d51246c654a50e6ae8a1cc9245e42cfaea22" + "00" + "Kz5BZ8BoehFxJQijvGE927sxJJ65sxKDJr5KGDucsTUjmdo84oRi"
		
		//L1tyegF2Mt8WGriKvDXm6THgKCnTjcRR2CnMah3YP6UFaNvrSd6d
		
		console.log("STR: " + str + " - " + str.length)
		var checksum = CryptoUtil.getChecksum32(str) 
		console.log("CHECKSUM: " + checksum)
		str = str + checksum
		console.log("STR W/CHECKSUM: " + str + " - " + str.length)
		var bytes = Buffer.from(str, 'hex')
		var enc = bs58.encode(bytes)
		console.log("ENC: " + enc + " - " + enc.length)
		
		
		bytes = Buffer.from(masterPrivateKey, 'hex')
		enc = bs58.encode(bytes)
		console.log("ENC MPK: " + enc + " - " + enc.length)
		
		//L1tyegF2Mt8WGriKvDXm6THgKCnTjcRR2CnMah3YP6UFaNvrSd6d
		//02B33CFC6F07A5E4C542C240A21683FA10D3D33EE40D52191FEB24E097478973BB
		//02b33cfc6f07a5e4c542c240a21683fa10d3d33ee40d52191feb24e097478973bb
		
				
		//Public key creation - xpub661MyMwAqRbcGdRF7Aa79CJLzUM6gw7jd3knnCZJfqb6oWaC598xgV96feHqKUWxjXQ6yUYaZW4yMaCKyCYYz2V5xJaB6X6E6AYxxreDeUD
		var publicStr = "0488B21E" + "00" + "00000000" + "00000000" + masterChainCode + compressedPublicKey
		var publicChecksum = CryptoUtil.getChecksum32(publicStr)
		publicStr = publicStr + publicChecksum
		bytes = Buffer.from(publicStr, 'hex')
		enc = bs58.encode(bytes)
		console.log("ENC PUBLIC: " + enc + " - " + enc.length)
		
		return {m: masterPrivateKey, c: masterChainCode, M: masterPublicKey}
		
	}
}