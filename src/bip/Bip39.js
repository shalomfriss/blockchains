import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import { CryptoUtil } from './../crypto/CryptoUtil';
import Words from './../wallet/wordlist.json';
import crypto from 'crypto';
import unorm from 'unorm';


export class Bip39 {
	
	
	/**
		Generate entropy of size, 128, 160, 192, 224 or 256	
		@param amount:Number - An integer that can take one of the values [128, 160, 192, 224, 256]
	*/
	static generateEntropy(amount) {
		if(amount % 32 != 0 || amount < 128 || amount > 256) {
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
	
	/**
		Generate the entropy string from the word string
		@param wordString:String - A string containing the mnemonic words	
	*/
	static generateEntropyFromWords(wordString:String) {
		var words = wordString.split(" ")
		console.log(words)
		var indices = []
		for(var i = 0; i < words.length; i++) {
			var word = words[i].trim()
			var ind = Bip39.wordsRev[word]
			indices.push(ind)
			
			console.log("INDEX: " + word + " - " + ind + " - " +  Words.words[ind] )
			
			
		}
		
		var preparedArrayBuffer = new Uint32Array(indices);
		var bytes = new Uint8Array(preparedArrayBuffer);
		var result = sjcl.codec.bytes.toBits(bytes);
		
		//var checksum =  sjcl.bitArray.bitSlice(result, 0, checksumLengthInBits)
		console.log(result)
		
		
	}
	
	
	static generateMnemonicWordsFromEntropy(entropy) {
		if(entropy.length < 32 || entropy.length > 64 || entropy.length % 4 !== 0) {
			console.log("ERROR:  Entropy must be between 128 and 256 bit and divisible by 4")
			return	
		}
		
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
	
	
	
	static createSeed(mnemonic = "", passphrase = "") {
		
		var salt = "mnemonic" + passphrase
		
		//format the string
		mnemonic = mnemonic.trim() 
		mnemonic = mnemonic.split(/\s+/).join(" ")
		
		//mnemonic = mnemonic.normalize('NFKD')
		mnemonic = unorm.nfkd(mnemonic)
		salt = unorm.nfkd(salt)
		
		//A bit of a cheat, had some issues with SJCL in this case, the code did not generate the correct
		//hash so I had to use crypto
		const seed = crypto.pbkdf2Sync(mnemonic, salt, 2048, 64, 'sha512');
		return seed.toString('hex')
		
	}
	
}

Bip39.wordsRev = []
for(var i = 0; i < Words.words.length; i++) {
	Bip39.wordsRev[Words.words[i]] = i
}

