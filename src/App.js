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
	var pkey = "1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd"
	console.log("Private key HEX: " + pkey)
	
	var wif = KeyGenerator.wifFromPrivateKey(pkey)
	console.log("Private key WIF: " + wif)
	
	var privateKey = KeyGenerator.privateKeyFromWIF(wif)
	
	
    var publicKey = KeyGenerator.generatePublicKey(pkey)
    var uncompressedPublicKey = KeyGenerator.generateBitcoinPublicKey(pkey)
    var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(pkey)
	console.log("Uncompressed Public key: " + uncompressedPublicKey)
	console.log("Compressed Public key: " + compressedPublicKey)
	
	var b64 = KeyGenerator.base64(pkey)
	console.log("Base 64 private key: " + b64)
	
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