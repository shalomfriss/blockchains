import {sjcl} from './../crypto/LocalExports';
import 'sjcl/core/bn'; 

/**
	A VarInt as specified here http://learnmeabitcoin.com/glossary/varint
	USAGE: 
		Feed in a regular hex number as you would like	
*/
export class VarInt {
	
	constructor() {
		this.prefix = ""
		this.postfix = ""
		this._value = 0
	}
	
	get value() {
		return this.prefix + this.changeEndianness(this.postfix)
	}
	
	set value(aValue) {
		
		this._value = aValue
		var bn = new sjcl.bn(this._value)
		
		if(this._value.toLowerCase().substr(0, 2) == "0x") {
			this.postfix = this._value.substr(2, this._value.length - 2)
		} else {
			this.postfix = this._value
		}
		
		//Integer size limits
		var lim1 = new sjcl.bn("0xfc")
		var lim2 = new sjcl.bn("0xffff")
		var lim3 = new sjcl.bn("0xffffffff")
		var lim4 = new sjcl.bn("0xffffffffffffffff")
		
		if(lim1.greaterEquals(bn)) {
			this.prefix = ""
			if(this.postfix.length % 2 != 0) { 
				this.postfix = this.postfix.padStart(2, '0')
			}
			return 
		} 
		
		if(lim2.greaterEquals(bn)) {
			this.prefix = "fd"
			if(this.postfix.length % 2 != 0) { 
				this.postfix = this.postfix.padStart(4, '0')
			}
			return
		}
		
		if(lim3.greaterEquals(bn)) {
			this.prefix = "fe"
			if(this.postfix.length % 2 != 0) { 
				this.postfix = this.postfix.padStart(8, '0')
			}
			return
		}
		
		if(lim4.greaterEquals(bn)) {
			this.prefix = "ff"
			if(this.postfix.length % 2 != 0) { 
				this.postfix = this.postfix.padStart(16, '0')
				console.log("PAD: " + this.postfix.padStart(16, '0'))
			}
			return
		}
		
		throw "Number is not in VarInt range!";
	}
	
	changeEndianness(string) {
        const result = [];
        let len = string.length - 2;
        while (len >= 0) {
          result.push(string.substr(len, 2));
          len -= 2;
        }
        return result.join('');
	}
	
	
}