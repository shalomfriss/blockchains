import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import bitcoin from 'bitcoinjs-lib';
import bigi from 'bigi';
import { KeyGenerator } from './crypto/KeyGenerator';
import { CryptoUtil } from './crypto/CryptoUtil';
import { WalletUtil } from './wallet/WalletUtil';
import { Validator } from './crypto/Validator';
import { Bip39 } from './bip/Bip39';
import { Bip32 } from './bip/Bip32';

class App extends Component {
  render() {
	
	//console.log("Generate a bitcoin address using bitcoinjs")
	var hash = bitcoin.crypto.sha256(Buffer.from('correct horse battery staple'))
    var d = bigi.fromBuffer(hash)
    var keyPair = new bitcoin.ECPair(d)
    var address = keyPair.getAddress()
	//console.log("Bitcoinjs address: " + address)
    
    
	var pkey = KeyGenerator.generatePrivateKey()
	pkey = "1e99423a4ed27608a15a2616a2b0e9e52ced330ac530edcc32c8ffc6a526aedd"
	//console.log("Private key HEX: " + pkey)
	
	var wif = KeyGenerator.wifFromPrivateKey(pkey)
	//console.log("Private key WIF: " + wif)
	
	
	var privateKey = KeyGenerator.privateKeyFromWIF(wif)
    var publicKey = KeyGenerator.generatePublicKey(pkey)
    var uncompressedPublicKey = KeyGenerator.generateBitcoinPublicKey(pkey)
    var compressedPublicKey = KeyGenerator.generateCompressedBitcoinPublicKey(pkey)
   
	/*
    console.log("Private key: " + privateKey)
    console.log("Public key: ")
    console.log(publicKey)
	console.log("Uncompressed Public key: " + uncompressedPublicKey)
	console.log("Compressed Public key: " + compressedPublicKey)
	*/
	
	var b64 = CryptoUtil.base64(pkey)
	//console.log("Base 64 private key: " + b64)
	
	var btcAddress = KeyGenerator.generateBitcoinAddressFromPrivateKey('3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6')
	//console.log("BTC Address: " + btcAddress)
	Validator.validateBitcoinAddress(btcAddress)
    
    
    //WALLET 
	var mnemonic = Bip39.generateMnemonicWords()
	//console.log("Mnemonic: " + mnemonic)
	
	
	//var seed = Bip39.createSeed(mnemonic, "")	
	//5b56c417303faa3fcba7e57400e120a0ca83ec5a4fc9ffba757fbe63fbd77a89a1a3be4c67196f57c39a88b76373733891bfaba16ed27a813ceed498804c0570
    var seed = Bip39.createSeed('army van defense carry jealous true garbage claim echo media make crunch', "")	
    var keys = Bip32.createMasterKeys(seed)
    
    /*
    console.log("SEED: " + seed)
    console.log("Master private key: " + keys.m)
   	console.log("Master public key: " + keys.M)       
    */
    
    
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

