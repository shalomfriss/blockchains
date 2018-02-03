import {sjcl} from './../crypto/LocalExports';
import bs58 from 'bs58';

export class Validator {
	
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