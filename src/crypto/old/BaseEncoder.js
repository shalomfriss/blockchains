export Class BaseEncoder {
	
	static alphabet = ""
	static base = 1
	
	constructor() {
		
	}
	
	static encode(input) {
		
		if (input.length === 0) return ''
		
		var encoded = ''
		while(input) {
			var remainder = input % BaseEncoder.base
            input = Math.floor(input / BaseEncoder.base)
            encoded = BaseEncoder.alphabet[remainder].toString() + encoded
        }
        return encoded
	}	
	
	static decode(input) {
		
	}
}