import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import { CryptoUtil } from './../crypto/CryptoUtil';
import Words from './wordlist.json';
import crypto from 'crypto';
import bs58 from 'bs58';


export class WalletUtil {
	static generateMnemonicWords() {
		
		//Gen randrom 256 bit number
		var entropy = CryptoUtil.getRandomNumber128()
		var mnemonic = WalletUtil.generateMnemonicWordsFromEntropy(entropy)	
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
		
		//5b56c417303faa3fcba7e57400e120a0ca83ec5a4fc9ffba757fbe63fbd77a89a1a3be4c67196f57c39a88b76373733891bfaba16ed27a813ceed498804c0570
		
		mnemonic = "army van defense carry jealous true garbage claim echo media make crunch"
		var salt = "mnemonic" + passphrase
		
		//format the string
		mnemonic = mnemonic.trim() 
		mnemonic = mnemonic.split(/\s+/).join(" ");
		
		
		//A bit of a cheat, had some issues with SJCL in this case, the code did not generate the correct
		//hash so I had to use crypto
		const seed = crypto.pbkdf2Sync(mnemonic, salt, 2048, 64, 'sha512');
		return seed.toString('hex')
		
	}
	
	static validateBitcoinAddress(address) {
		if (address.length < 26 || address.length > 35) return false        
        
        try {
	        var dec = bs58.decode(address)
	        var hex = dec.toString('hex')
	        var checksum = hex.substring(hex.length - 8, hex.length);
	        var strNoChecksum = hex.substring(0, hex.length - 8);
	        var bits = sjcl.codec.hex.toBits(strNoChecksum)
			var hash1 = sjcl.hash.sha256.hash(bits)
			hash1 = sjcl.hash.sha256.hash(hash1)
			var computedStr = sjcl.codec.hex.fromBits(hash1)		
			var computedChecksum = computedStr.substr(0, 8)
			
			return (computedChecksum.toUpperCase() === checksum.toUpperCase())
        }
        catch(e) {
	        return false
        }
	}
}