import bs58 from 'bs58';
import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 
import 'sjcl/core/ecc'; 
import 'sjcl/core/ripemd160';
import { CryptoUtil } from './../crypto/CryptoUtil';
import Words from './wordlist.json';

export class WalletUtil {
	static generateMnemonicWords() {
		
		//Gen randrom 256 bit number
		var rando = CryptoUtil.getRandomNumber128()
		rando = "0c1e24e5917779d297e14d45f14e1a1a"
		
		//Take checksum of entropy/32
		var bits =  sjcl.codec.hex.toBits(rando)
		var hash = sjcl.hash.sha256.hash(bits);
		var hashString = sjcl.codec.hex.fromBits(hash); 
		var checksum = hashString.substr(0, 1).toUpperCase()   
		
		var rando = rando + checksum
		
		var bits = sjcl.codec.hex.toBits(rando)
		var len = sjcl.bitArray.bitLength(bits)
		
		//Split the array into 12 sections of 11 bits each and get the digit
		var mnemonicString = ""
		for(var i = 0; i < len; i += 11) {
			var n1 = sjcl.bitArray.extract(bits, i, 11)
			mnemonicString += (i == 0 ? "" : " ") + Words.words[n1] 
		}
		return mnemonicString		
	}	
	
	static createSeed(mnemonic, passphrase = "") {
		mnemonic = "army van defense carry jealous true garbage claim echo media make crunch"
		var salt = "mnemonic"
		
		
		mnemonic = mnemonic.split(/\s/g).filter(function(x) { return x.length; });
		mnemonic = mnemonic.join(" ")
		
		
		var hmacSHA512 = function(key) {
	        var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha512);
	        this.encrypt = function() {
	            return hasher.encrypt.apply(hasher, arguments);
	        };
	    };
	    
		var mnemonicNormalized = mnemonic.normalize("NFKD")
		var passphrase = "mnemonic" + passphrase.normalize("NFKD")
		
        var mnemonicBits = sjcl.codec.utf8String.toBits(mnemonicNormalized);
        var passphraseBits = sjcl.codec.utf8String.toBits(passphrase);
        var result = sjcl.misc.pbkdf2(mnemonicBits, passphraseBits, 2048, 512, hmacSHA512);
        var hashHex = sjcl.codec.hex.fromBits(result);
        return hashHex;
        
        

	}
}