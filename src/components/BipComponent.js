import React, { Component } from 'react';
import { Bip39 } from '../bip/Bip39';
import { Bip32 } from '../bip/Bip32';

export class BipComponent extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
		    words: "",
		    passphrase: "", 
		    seed: ""
		};
	
	    // This binding is necessary to make `this` work in the callback
	    this.handleGenerateClick = this.handleGenerateClick.bind(this)
	    this.handlePassphraseChange = this.handlePassphraseChange.bind(this)
	}
	
	handlePassphraseChange(evt) {
    	this.setState({ passphrase: evt.target.value });
  	}
  	
  	
  	
	handleGenerateClick() {
		var passphrase = this.state.passphrase
		var words = Bip39.generateMnemonicWords()
		var seed = Bip39.createSeed(words, passphrase)
		
		this.setState({
			words: words,
			seed: seed
		})
		
		this.refs.generatedWords.value = words
		console.log(this.refs.generatedWords.value)
	}
	
	render() {
	    return (
	       <div className="uk-container uk-padding  mainContainer">
	       
	       			<div className="uk-margin">
	       				<label>Generated words</label>

		   					<button className="uk-button uk-column-1-3 uk-button-small uk-button-primary generateButton" onClick={this.handleGenerateClick}>Generate words</button>
		   					<input className="uk-input uk-column-1-1 uk-form-width-large uk-form-small generateWords" type="text" ref="generatedWords"></input>
					 </div>   
					 
					 
					 <div className="uk-margin">   
						<label>Passphrase</label>
					    <input className="uk-input uk-form-width-large uk-form-small passphrase" type="text" ref="passphrase" onChange={this.handlePassphraseChange}></input>
					    
					    <label>Seed</label>
					    <input className="uk-input uk-form-width-large uk-form-small bip39seed" type="text" ref="seed" value={this.state.seed}></input>
					</div>
					
				    
			</div>

	    );
  	}
  	
  	
}