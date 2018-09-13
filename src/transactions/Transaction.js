import { TransactionInput } from './TransactionInput';
import { TransactionOutput } from './TransactionOutput';

/**
	Transaction format:
	version number (4 bytes) - Currently 1
	in-counter (1-9 bytes) Positive integer
	list of inputs <in-counter> many inputs - The first input of the first transaction is called "coinbase"
	out-counter (1-9 bytes) positive integer
	list of outputs <out-counter> many outputs - The outputs of the first transaction spend the mied bitcoins for the block
	lock_time (4 bytes) - If non-zero and sequence number are < 0xffffffff: block height or timestamp when transaction is final	
*/
export class Transaction {
	
	constructor() {
		this.version = "01000000"
		this.locktime = "00000000"
		this.inputs = []
		this.outputs = []
	}
	
	//Every input has a 4-byte sequence number, it is usually set to maximum, 
	//but to disable time locked transaction,at least in one input it should be set less than maximum.
	addInput(transactionId, index, scriptSig, sequence) {
		let newInput = new TransactionInput()
		newInput.txid = transactionId
		newInput.vout = index
		newInput.scriptSig = scriptSig
		newInput.sequence = sequence || ((this.locktime == 0) ? 4294967295 : 0);
		
		this.inputs[this.inputs.length] = newInput
	}
	
	
	addOuput(value, scriptPubKey) {
		let newOutput = new TransactionOutput()
		newOutput.value = value
		newOutput.scriptPubKey = scriptPubKey
		
		this.outpus[this.outputs.length] = newOutput
	}
	
	setTransactionId() {
		
	}
	
	toJSON() {
		let json = {}
		json.version = this.version
		json.locktime = this.locktime
		json.inputs = this.inputs
		json.outputs = this.outputs
		return JSON.stringify(json)
	}
	
	serialized() {
		
	}
	
	
	
}