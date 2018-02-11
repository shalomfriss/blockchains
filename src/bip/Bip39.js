import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import { CryptoUtil } from './../crypto/CryptoUtil';
import Words from './../wallet/wordlist.json';
import crypto from 'crypto';


export class Bip39 {
	static generateMnemonicWords() {
		
		//Gen randrom 128 bit number
		var entropy = CryptoUtil.getRandomNumber128()
		var mnemonic = Bip39.generateMnemonicWordsFromEntropy(entropy)	
		return mnemonic
	}	
	
	static generateMnemonicWordsFromEntropy(entropy) {
		
		//Take checksum of entropy/32
		var bits =  sjcl.codec.hex.toBits(entropy)
		var hash = sjcl.hash.sha256.hash(bits);
		var hashString = sjcl.codec.hex.fromBits(hash); 
		var checksum = hashString.substr(0, 1).toUpperCase()   
		
		entropy = entropy + checksum
		bits = sjcl.codec.hex.toBits(entropy)
		var len = sjcl.bitArray.bitLength(bits)
		
		//Split the array into 12 sections of 11 bits each and get the digit
		var mnemonicString = ""
		for(var i = 0; i < len; i += 11) {
			var n1 = sjcl.bitArray.extract(bits, i, 11)
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