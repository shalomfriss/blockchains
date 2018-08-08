export class TransactionInput {
	constructor() {
		this.txid = ""
		this.vout = 0
		this.scriptSig = ""
		this.sequence = ""
	}
	
	toJSON() {
		var obj = {}
		obj.txid = this.txid
		obj.vout = this.vout
		obj.scriptSig = this.scriptSig
		obj.sequence = this.sequence
		
		return JSON.stringify(obj)
	}
	
	serialized() {
		
	}
	
}