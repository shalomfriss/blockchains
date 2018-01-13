import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import bitcoin from 'bitcoinjs-lib';
import bigi from 'bigi';
//import BigInteger from 'bigi';
import { Base58 } from './crypto/Base58';
import bigInt from 'big-integer';
import { KeyGenerator } from './crypto/KeyGenerator';
import ECC from './crypto/ECC';

class App extends Component {
  render() {
	  
	var hash = bitcoin.crypto.sha256(Buffer.from('correct horse battery staple'))
    var d = bigi.fromBuffer(hash)
    var keyPair = new bitcoin.ECPair(d)
    var address = keyPair.getAddress()
	log(address)
    
    
    /*
    var b = new Base58()
    b.encode("This is a test")
    
    var b1 = BigInteger.fromHex("02")
    var b2 = BigInteger.fromHex("0100")
    var b3 = b1.pow(b2)
    var b4 = BigInteger.fromHex("01")
    
    var b5 = b3.subtract(b4)
    
    console.log(b5.toHex())
    
    var maximumByte = bigInt("FF", 16);
	
	console.log("BIG")
	*/
	
	var pkey = KeyGenerator.generatePrivateKey()
	KeyGenerator.generatePrivateKeyWIF(pkey)
	
	//console.log((Math.pow(2, 256) - 1) * Math.random())
    
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