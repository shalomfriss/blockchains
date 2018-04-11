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
		    entropyEnabled: false
		};
		
	    // This binding is necessary to make `this` work in the callback
	    this.handleGenerateClick = this.handleGenerateClick.bind(this)
	    this.handlePassphraseChange = this.handlePassphraseChange.bind(this)
	    this.handleWordsChanged = this.handleWordsChanged.bind(this)
	    this.handleEntropyCheckboxClick = this.handleEntropyCheckboxClick.bind(this)
	    this.handleGenerateEntropyClicked = this.handleGenerateEntropyClicked.bind(this)
	    
	    
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
		
		Bip39.generateEntropyFromWords(words)
  	}
  	
  	/**
	  	Generate button was clicked	
	*/
	handleGenerateClick() {
		var passphrase = this.state.passphrase
		var words = Bip39.generateMnemonicWords()
		var seed = Bip39.createSeed(words, passphrase)
		
		this.setState({
			passphrase: passphrase,
			words: words,
			seed: seed
		})
		
		this.refs.generatedWords.value = words
		
		Bip39.generateEntropyFromWords(words)
	}
	
	/**
		The seed words changed	
	*/
	handleWordsChanged(evt) {
		var passphrase = this.state.passphrase
		var words = this.refs.generatedWords.value
		var seed = Bip39.createSeed(words, passphrase)
		
		this.setState({
			passphrase: passphrase, 
			words: words,
			seed: seed
		})
		
		Bip39.generateEntropyFromWords(words)
	}
	
	
	handleGenerateEntropyClicked() {
		console.log("ENT")	
	}
	
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
	
	enableEntropyMode() {
		this.setState({
			entropyOpacity: 1, 
			entropyEvents: "all",
			wordsOpacity: 0.4,
			wordsEvents: "none"
		})
	}
	
	disableEntropyMode() {
		this.setState({
			entropyOpacity: 0.4, 
			entropyEvents: "none",
			wordsOpacity: 1,
			wordsEvents: "all"
		})
	}
	
	
	render() {
	    return (
	       <div className="uk-container uk-padding  Bip32Container">
	       			
	       			<div className="uk-margin inputRow entropyRow">
	       				<input type="checkbox" className="entropyCheckbox" onChange={this.handleEntropyCheckboxClick}></input>
	       				<label className="entropyCheckboxLabel">Use manual entropy</label>
	       			</div>
	       			
	       			<div className="uk-margin inputRow"  style={{opacity: this.state.entropyOpacity, pointerEvents: this.state.entropyEvents}}>
		   				<label className="inputLabel">Input seed or press "generate entropy" to generate entropy</label>
		   				<input className="uk-input uk-column-1-1 uk-form-small inputField" type="text" ref="generatedSeed" onChange={this.handleGenerateEntropyClicked} placeholder="Seed"></input>
		   				<button className="uk-button uk-column-1-3 uk-button-small uk-button-primary aButton" onClick={this.handleGenerateSeedClick}>Generate Entropy</button>
					 </div>
					 
					 
					 
					 
	       			<div className="uk-margin inputRow"  style={{opacity: this.state.wordsOpacity, pointerEvents: this.state.wordsEvents}}>
		   				<label className="inputLabel">Input words or press "generate words" to generate words</label>
		   				<input className="uk-input uk-column-1-1 uk-form-small inputField" type="text" ref="generatedWords" onChange={this.handleWordsChanged} placeholder="Seed words"></input>
		   				<button className="uk-button uk-column-1-3 uk-button-small uk-button-primary aButton" onClick={this.handleGenerateClick}>Generate words</button>
					 </div>   
					 
					 
					 
					 
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
					
			</div>

	    );
  	}
  	
  	
}