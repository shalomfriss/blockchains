import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import { CryptoUtil } from './../crypto/CryptoUtil';
import Words from './../wallet/wordlist.json';
import crypto from 'crypto';


export class Bip39 {
	
	/**
		Generate entropy of size, 128, 160, 192, 224 or 256	
		@param amount:Number - An integer that can take one of the values [128, 160, 192, 224, 256]
	*/
	static generateEntropy(amount) {
		
		if(amount % 32 != 0) {
			console.log("ERROR: Entropy amount has to be a multiple of 32 and in the rance [128, 256]")
			return
		}
		
		var numWords = amount / 32
		
		var randWords = null
		sjcl.random.startCollectors();
		randWords = sjcl.random.randomWords(numWords, 8)
	    sjcl.random.stopCollectors()
		var hash1 = sjcl.hash.sha256.hash(randWords)  
		var hex = sjcl.codec.hex.fromBits(hash1)
		
		return hex	
	}
	
	static generateMnemonicWords() {
		
		//Gen randrom 128 bit number
		var entropy = CryptoUtil.getRandomNumber128()
		var mnemonic = Bip39.generateMnemonicWordsFromEntropy(entropy)	
		return mnemonic
	}	
	
	static generateMnemonicWordsFromEntropy(entropy) {
				
		var checksumLengthInBits = entropy.length * 4 / 32
		
		var bits =  sjcl.codec.hex.toBits(entropy)
		var hash = sjcl.hash.sha256.hash(bits);
		var checksum =  sjcl.bitArray.bitSlice(hash, 0, checksumLengthInBits)
		var newBits = sjcl.bitArray.concat(bits, checksum)
		var len = sjcl.bitArray.bitLength(newBits)
		
		//Split the array into 12 sections of 11 bits each and get the digit
		var mnemonicString = ""
		var n1		
		for(var i = 0; i < len; i += 11) {
			n1 = sjcl.bitArray.extract(newBits, i, 11)
			mnemonicString += (i === 0 ? "" : " ") + Words.words[n1] 
		}
		
		return mnemonicString		
	}	
	
	
	
	static createSeed(mnemonic, passphrase = "") {
		
		
		var salt = "mnemonic" + passphrase
		
		//format the string
		mnemonic = mnemonic.trim() 
		mnemonic = mnemonic.split(/\s+/).join(" ");
		
		
		//A bit of a cheat, had some issues with SJCL in this case, the code did not generate the correct
		//hash so I had to use crypto
		const seed = crypto.pbkdf2Sync(mnemonic, salt, 2048, 64, 'sha512');
		return seed.toString('hex')
		
	}
}