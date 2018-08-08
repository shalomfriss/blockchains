import React, { Component } from 'react';
import { Bip39 } from '../bip/Bip39';
import { Bip32 } from '../bip/Bip32';

export class BipComponent extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
		    words: "",
		    passphrase: "", 
		    seed: "",
		    entropyOpacity: 0.4,
		    wordsOpacity: 1,
		    entropyEvents: "none",
		    wordsEvents: "all",
		    entropyEnabled: false,
		    entropyFieldValid: false,
		    entropy: ""
		    
		};
		
	    // This binding is necessary to make `this` work in the callback
	    this.handleGenerateClick 			= this.handleGenerateClick.bind(this)
	    this.handlePassphraseChange 		= this.handlePassphraseChange.bind(this)
	    this.handleWordsChanged 			= this.handleWordsChanged.bind(this)
	    this.handleEntropyCheckboxClick 	= this.handleEntropyCheckboxClick.bind(this)
	    this.handleGenerateEntropyClicked 	= this.handleGenerateEntropyClicked.bind(this)
	    this.handleEntropyChanged 			= this.handleEntropyChanged.bind(this)
	    
	}
	
	componentDidMount() {
		this.disableEntropyMode()
	}
	
	/**
		The passphrase changed	
	*/
	handlePassphraseChange(evt) {
    	var passphrase = evt.target.value
		var words = this.refs.generatedWords.value
		var seed = Bip39.createSeed(words, passphrase)
		
		this.setState({
			passphrase: passphrase,
			words: words,
			seed: seed
		})
		
		//Bip39.generateEntropyFromWords(words)
  	}
  	
  	/**
	  	Generate button was clicked	
	*/
	handleGenerateClick() {
		var passphrase = this.state.passphrase
		var words = Bip39.generateMnemonicWords()
		var seed = Bip39.createSeed(words, passphrase)
		var keys = Bip32.createMasterKeys(seed)
		console.log(keys)
		
		this.setState({
			passphrase: passphrase,
			words: words,
			seed: seed
		})
		
		this.refs.generatedWords.value = words
		
		//Bip39.generateEntropyFromWords(words)
	}
	
	/**
		The seed words changed	
	*/
	handleWordsChanged(evt) {
		var passphrase = this.state.passphrase
		var words = this.refs.generatedWords.value
		var seed = Bip39.createSeed(words, passphrase)
		var keys = Bip32.createMasterKeys(seed)
		
		this.setState({
			passphrase: passphrase, 
			words: words,
			seed: seed
		})
		
		//Bip39.generateEntropyFromWords(words)
	}
	
	
	/************************************************************************************************/
	//ENTROPY SECTION
	/************************************************************************************************/
	/**
		Generate entropy was clicked	
	*/
	handleGenerateEntropyClicked() {
		
		this.setState({
			entropyFieldValid: true
		})
		var ent = Bip39.generateEntropy(128)
		this.refs.generatedEntropy.value = ent
		var words = Bip39.generateMnemonicWordsFromEntropy(ent)
		this.refs.generatedWords.value = words
		
		var passphrase = this.state.passphrase
		var seed = Bip39.createSeed(words, passphrase)
		var keys = Bip32.createMasterKeys(seed)
		console.log("KEYS E--------")
		console.log(keys)
		
		this.setState({
			passphrase: passphrase, 
			words: words,
			seed: seed
		})
		//this.handleWordsChanged()
	}
	
	/**
		Entropy input text changed	
	*/
	handleEntropyChanged() {
		
		var entropyInput = this.refs.generatedEntropy.value
		
		
		var amount = entropyInput.length
		
		if((amount * 4) % 32 != 0 || amount * 4 < 128 || amount * 4 > 256) {
			console.log("ERROR: Entropy amount has to be a multiple of 32 and in the range [128, 256] bits")
			this.refs.generatedWords.value = ""
			this.setState({
				entropyFieldValid: false
			})
			return
		}
		
		var words = Bip39.generateMnemonicWordsFromEntropy(entropyInput)
		this.refs.generatedWords.value = words
		
		
		
		var passphrase = this.state.passphrase
		var seed = Bip39.createSeed(words, passphrase)
		var keys = Bip32.createMasterKeys(seed)
		console.log("KEYS--------")
		console.log(keys)
		
		this.setState({
			entropy: entropyInput,
			passphrase: passphrase, 
			words: words,
			seed: seed,
			entropyFieldValid: true
		})
				
		
	}
	
	/**
		Entropy checkbox was clicked	
	*/
	handleEntropyCheckboxClick() {
		console.log("test")
		this.setState({entropyEnabled: !this.state.entropyEnabled})
		
		if(this.state.entropyEnabled === true) {
			this.disableEntropyMode()
		}
		else {
			this.enableEntropyMode()
		}
	}
	
	
	/******************************************************************************/
	//UTILS
	/******************************************************************************/
	/**
		Enable the entropy section	
	*/
	enableEntropyMode() {
		this.setState({
			entropyOpacity: 1, 
			entropyEvents: "all",
			wordsOpacity: 0.4,
			wordsEvents: "none"
		})
	}
	
	/**
		Disable the entropy section	
	*/
	disableEntropyMode() {
		this.setState({
			entropyOpacity: 0.4, 
			entropyEvents: "none",
			wordsOpacity: 1,
			wordsEvents: "all"
		})
	}
	
	
	render() {
		
		var entropyClasses = "uk-input uk-column-1-1 uk-form-small inputField"
		if(this.state.entropyFieldValid === true) {
			entropyClasses += " uk-form-success"
		}
		else {
			//if(this.state.entropy.length > 0) {
				entropyClasses += " uk-form-danger"
			//}
		}
		
	    return (
	       <div className="uk-container uk-padding  Bip32Container">
	       			
	       			<div className="uk-margin inputRow entropyRow">
	       				<input type="checkbox" className="entropyCheckbox" onChange={this.handleEntropyCheckboxClick}></input>
	       				<label className="entropyCheckboxLabel">Use manual entropy</label>
	       			</div>
	       			
	       			
	       			{/* Entropy section */}
	       			<div className="uk-margin inputRow"  style={{opacity: this.state.entropyOpacity, pointerEvents: this.state.entropyEvents}}>
		   				<label className="inputLabel">Input seed or press "generate entropy" to generate 
		   					entropy. Entropy amount has to be a multiple of 32 and in the range [128, 256] bits</label>
		   				<input className={entropyClasses} type="text" ref="generatedEntropy" onChange={this.handleEntropyChanged} 
		   					placeholder="Entropy" pattern="[A-Za-z]{3}"></input>
		   				<button className="uk-button uk-column-1-3 uk-button-small uk-button-primary aButton generateEntropyButton" onClick={this.handleGenerateEntropyClicked}>Generate Entropy</button>
					 </div>
					 
					 
					 {/* Mnemonic section */}
	       			<div className="uk-margin inputRow"  style={{opacity: this.state.wordsOpacity, pointerEvents: this.state.wordsEvents}}>
		   				<label className="inputLabel">Input words or press "generate words" to generate mnemonic words</label>
		   				<input className="uk-input uk-column-1-1 uk-form-small inputField" type="text" ref="generatedWords" 
		   					onChange={this.handleWordsChanged} placeholder="Mnemonic words"></input>
		   				<button className="uk-button uk-column-1-3 uk-button-small uk-button-primary aButton" 
		   					onClick={this.handleGenerateClick}>Generate words</button>
					 </div>   
					 
					 
					 {/* Passphrase and seed section */}
					 <div className="uk-margin inputRow">   
					 	
					 	<div className="formElement">
					 		<label className="inputLabel">Passphrase</label>
					    	<input className="uk-input uk-form-small inputField" type="text" ref="passphrase" onChange={this.handlePassphraseChange} placeholder="Passphrase"></input>
					    </div>
					    
					    <div className="formElement">
					    	<label className="inputLabel">Seed</label>
							<input className="uk-input uk-form-small inputField" type="text" ref="seed" value={this.state.seed} placeholder="Seed"></input>
					    </div>
					</div>
					
					
					{/* Key section  */}
					<div className="uk-margin inputRow">   
					 	
					 	<div className="formElement">
					 		<label className="inputLabel">Private Key</label>
					    	<input className="uk-input uk-form-small inputField" type="text" ref="privateKey" placeholder="Private Key" style={{opacity: 0.8, pointerEvents: "none"}} value={this.state.privateKey}></input>
					    </div>
					    
					    <div className="formElement">
					    	<label className="inputLabel">Public Key</label>
							<input className="uk-input uk-form-small inputField" type="text" ref="publicKey" placeholder="Public Key" style={{opacity: 0.8, pointerEvents: "none"}} value={this.state.publicKey}></input>
					    </div>
					</div>
					
					
					
			</div>

	    );
  	}
  	
  	
}