export class TransactionOutput {
	constructor() {
		this.value = 0
		this.scriptPubKey = ""
	}
	
	toJSON() {
		var obj = {}
		obj.value = this.value
		obj.scriptPubKey = this.vout
				
		return JSON.stringify(obj)
	}
	
	serialized() {
		
	}
}