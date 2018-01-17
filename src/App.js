import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import bitcoin from 'bitcoinjs-lib';
import bigi from 'bigi';
//import BigInteger from 'bigi';
import { Base58 } from './crypto/Base58';
import { KeyGenerator } from './crypto/KeyGenerator';


console.log("Load App")
class App extends Component {
  render() {
	
	console.log("Generate a bitcoin address using bitcoinjs")
	var hash = bitcoin.crypto.sha256(Buffer.from('correct horse battery staple'))
    var d = bigi.fromBuffer(hash)
    var keyPair = new bitcoin.ECPair(d)
    var address = keyPair.getAddress()
	log(address)
    
    
	var pkey = KeyGenerator.generatePrivateKey()
	var wif = KeyGenerator.generatePrivateKeyWIF(pkey)
	var privateKey = KeyGenerator.privateKeyFromWIF(wif)
    
    //KeyGenerator.generatePublicKey()
    
    
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

export var log = console.log.bind(console)
var print = console.log.bind(console)