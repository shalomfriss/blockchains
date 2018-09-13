export class ByteUtils {
	
	/**
		convert a hex string to little endian
		@param hexString:String - a hex string	
	*/
	static toLittleEndian(hexString) {
		let result = hexString.split("").reverse()
		for(var i = 0; i < result.length - 1; i += 2) {
			var temp = result[i]
			result[i] = result[i + 1]
			result[i + 1] = temp
		}
		return result.join("");
	}
	
	/**
		convert a hex string to big endian
		@param hexString:String - a hex string	
	*/
	static toBigEndian(hexString) {
		let result = hexString.split("")
		for(var i = 0; i < result.length - 1; i += 2) {
			var temp = result[i]
			result[i] = result[i + 1]
			result[i + 1] = temp
		}
		return result.reverse().join("");
	}
	
	
}

