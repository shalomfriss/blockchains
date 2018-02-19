export class Base58 {
	
	static BITCOIN = "bitcoin"
	static RIPPLE = "ripple"
	
	constructor(){
		this.bitcoin = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
		this.ripple = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"
		
		this.alpha = this.bitcoin
		this.mode = Base58.BITCOIN
		this.base = this.alpha.length
	}
	
	mode(aMode) {
		if(aMode !== Base58.BITCOIN && aMode !== Base58.RIPPLE) {
			throw 'Base58: No such mode!'
		}	
		
		if(aMode === Base58.BITCOIN) {
			this.alpha = this.bitcoin
			this.base = this.alpha.length
		}
		else if(aMode === Base58.RIPPLE) {
			this.alpha = this.ripple
			this.base = this.alpha.length
		}
	}
	
	encode(input) {  
		
        
        var bytes = [];
        for(var i = 0; i < input.length; i++){
		    bytes.push(input.charCodeAt(i))
		    //console.log(input.charCodeAt(i))
		}
		//console.log(bytes)
		
		input = Number(input)
		
        
		var encoded = ''
		while(input) {
			var remainder = input % this.base
            input = Math.floor(input / this.base)
            encoded = this.alpha[remainder].toString() + encoded
        }
        return encoded
        
	}
	
	decode(input) {
		input = String(input)
                        
        var decoded = 0;
        while(input) {
            var alphabetPosition = this.alpha.indexOf(input[0]);
            if (alphabetPosition < 0)
            {
	            throw '"decode" can\'t find "' + input[0] + '" in the alphabet: "' + this.alpha + '"';
            }
                
            var powerOf = input.length - 1;
            decoded += alphabetPosition * (Math.pow(this.base, powerOf));
            input = input.substring(1);
        }
		return decoded;
	}
}

