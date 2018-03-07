import React from 'react';
import crypto from 'crypto';
import { Bip32 } from './Bip32';
 
//https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki

test('Check BIP32 test vector 1', () => {
	var seed = "000102030405060708090a0b0c0d0e0f"
	
	var mprv = "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi"
	var mpub = "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8"
	
	var m0Hprv = "xprv9uHRZZhk6KAJC1avXpDAp4MDc3sQKNxDiPvvkX8Br5ngLNv1TxvUxt4cV1rGL5hj6KCesnDYUhd7oWgT11eZG7XnxHrnYeSvkzY7d2bhkJ7"
	var m0Hpub = "xpub68Gmy5EdvgibQVfPdqkBBCHxA5htiqg55crXYuXoQRKfDBFA1WEjWgP6LHhwBZeNK1VTsfTFUHCdrfp1bgwQ9xv5ski8PX9rL2dZXvgGDnw"
	
	var m0H1prv = "xprv9wTYmMFdV23N2TdNG573QoEsfRrWKQgWeibmLntzniatZvR9BmLnvSxqu53Kw1UmYPxLgboyZQaXwTCg8MSY3H2EU4pWcQDnRnrVA1xe8fs"
	var m0H1pub = "xpub6ASuArnXKPbfEwhqN6e3mwBcDTgzisQN1wXN9BJcM47sSikHjJf3UFHKkNAWbWMiGj7Wf5uMash7SyYq527Hqck2AxYysAA7xmALppuCkwQ"
	
	var m0H12Hprv = "xprv9z4pot5VBttmtdRTWfWQmoH1taj2axGVzFqSb8C9xaxKymcFzXBDptWmT7FwuEzG3ryjH4ktypQSAewRiNMjANTtpgP4mLTj34bhnZX7UiM"
	var m0H12Hpub = "xpub6D4BDPcP2GT577Vvch3R8wDkScZWzQzMMUm3PWbmWvVJrZwQY4VUNgqFJPMM3No2dFDFGTsxxpG5uJh7n7epu4trkrX7x7DogT5Uv6fcLW5"
	
	var m0H12H2prv = "xprvA2JDeKCSNNZky6uBCviVfJSKyQ1mDYahRjijr5idH2WwLsEd4Hsb2Tyh8RfQMuPh7f7RtyzTtdrbdqqsunu5Mm3wDvUAKRHSC34sJ7in334"
	var m0H12H2pub = "xpub6FHa3pjLCk84BayeJxFW2SP4XRrFd1JYnxeLeU8EqN3vDfZmbqBqaGJAyiLjTAwm6ZLRQUMv1ZACTj37sR62cfN7fe5JnJ7dh8zL4fiyLHV"
	
	var m0H12H21000000000prv = "xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76"
	var m0H12H21000000000pub = "xpub6H1LXWLaKsWFhvm6RVpEL9P4KfRZSW7abD2ttkWP3SSQvnyA8FSVqNTEcYFgJS2UaFcxupHiYkro49S8yGasTvXEYBVPamhGW6cFJodrTHy"
	
	var keysm = Bip32.createMasterKeys(seed)
	expect(Bip32.serializeKey(keysm.m)).toEqual(mprv)
	expect(Bip32.serializeKey(keysm.M)).toEqual(mpub)
	
	var prvm0H = Bip32.privateChildFromPrivateParent(keysm.m, 2147483648 + 0)
	var pubm0H = Bip32.publicKeyFromPrivateKey(prvm0H)
	var pubkey0H = Bip32.publicChildFromPublicParent(keysm.M, 2147483648 + 0)		//Should not be able to derive hardened key
	var pubChild0H = Bip32.publicChildFromPrivateParent(keysm.m, 2147483648 + 0) 
	expect(Bip32.serializeKey(prvm0H)).toEqual(m0Hprv)
	expect(Bip32.serializeKey(pubm0H)).toEqual(m0Hpub)
	expect(pubkey0H).toEqual(undefined)
	expect(Bip32.serializeKey(pubChild0H)).toEqual(m0Hpub)
	
	
	var prvm0H1 = Bip32.privateChildFromPrivateParent(prvm0H, 1)
	var pubm0H1 = Bip32.publicKeyFromPrivateKey(prvm0H1)
	var pubkey0H1 = Bip32.publicChildFromPublicParent(pubm0H, 1)
	var pubChild0H1 = Bip32.publicChildFromPrivateParent(prvm0H, 1)
	expect(Bip32.serializeKey(prvm0H1)).toEqual(m0H1prv)
	expect(Bip32.serializeKey(pubm0H1)).toEqual(m0H1pub)
	expect(Bip32.serializeKey(pubkey0H1)).toEqual(m0H1pub)
	expect(Bip32.serializeKey(pubChild0H1)).toEqual(m0H1pub)
	
	
	
	var prvm0H12H = Bip32.privateChildFromPrivateParent(prvm0H1, 2147483648 + 2)
	var pubm0H12H = Bip32.publicKeyFromPrivateKey(prvm0H12H)	//Should not be able to derive hardened key
	var pubkey0H12H = Bip32.publicChildFromPublicParent(pubm0H1, 2147483648 + 2)
	var pubChild0H12H = Bip32.publicChildFromPrivateParent(prvm0H1, 2147483648 + 2)
	expect(Bip32.serializeKey(prvm0H12H)).toEqual(m0H12Hprv)
	expect(Bip32.serializeKey(pubm0H12H)).toEqual(m0H12Hpub)
	expect(pubkey0H12H).toEqual(undefined)
	expect(Bip32.serializeKey(pubChild0H12H)).toEqual(m0H12Hpub)
	
	
	
	var prvm0H12H2 = Bip32.privateChildFromPrivateParent(prvm0H12H, 2)
	var pubm0H12H2 = Bip32.publicKeyFromPrivateKey(prvm0H12H2)
	var pubkey0H12H2 =  Bip32.publicChildFromPublicParent(pubm0H12H, 2)
	var pubChild0H12H2 = Bip32.publicChildFromPrivateParent(prvm0H12H, 2)
	expect(Bip32.serializeKey(prvm0H12H2)).toEqual(m0H12H2prv)
	expect(Bip32.serializeKey(pubm0H12H2)).toEqual(m0H12H2pub)
	expect(Bip32.serializeKey(pubkey0H12H2)).toEqual(m0H12H2pub)
	expect(Bip32.serializeKey(pubChild0H12H2)).toEqual(m0H12H2pub)
	
	
	var prvm0H12H21000000000 = Bip32.privateChildFromPrivateParent(prvm0H12H2, 1000000000)
	var pubm0H12H21000000000 = Bip32.publicKeyFromPrivateKey(prvm0H12H21000000000)
	var pubkey0H12H21000000000 =  Bip32.publicChildFromPublicParent(pubm0H12H2, 1000000000)
	var pubChild0H12H21000000000 =  Bip32.publicChildFromPrivateParent(prvm0H12H2, 1000000000)
	expect(Bip32.serializeKey(prvm0H12H21000000000)).toEqual(m0H12H21000000000prv)
	expect(Bip32.serializeKey(pubm0H12H21000000000)).toEqual(m0H12H21000000000pub)
	expect(Bip32.serializeKey(pubkey0H12H21000000000)).toEqual(m0H12H21000000000pub)
	expect(Bip32.serializeKey(pubChild0H12H21000000000)).toEqual(m0H12H21000000000pub)
	
	
})



test('Check BIP32 test vector 2', () => {
	var seed = "fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542"
	
	var mprv = "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U"
	var mpub = "xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB"
	
	var m0prv = "xprv9vHkqa6EV4sPZHYqZznhT2NPtPCjKuDKGY38FBWLvgaDx45zo9WQRUT3dKYnjwih2yJD9mkrocEZXo1ex8G81dwSM1fwqWpWkeS3v86pgKt"
	var m0pub = "xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH"
	
	var m02147483647Hprv = "xprv9wSp6B7kry3Vj9m1zSnLvN3xH8RdsPP1Mh7fAaR7aRLcQMKTR2vidYEeEg2mUCTAwCd6vnxVrcjfy2kRgVsFawNzmjuHc2YmYRmagcEPdU9"
	var m02147483647Hpub = "xpub6ASAVgeehLbnwdqV6UKMHVzgqAG8Gr6riv3Fxxpj8ksbH9ebxaEyBLZ85ySDhKiLDBrQSARLq1uNRts8RuJiHjaDMBU4Zn9h8LZNnBC5y4a"
	
	var m02147483647H1prv = "xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef"
	var m02147483647H1pub = "xpub6DF8uhdarytz3FWdA8TvFSvvAh8dP3283MY7p2V4SeE2wyWmG5mg5EwVvmdMVCQcoNJxGoWaU9DCWh89LojfZ537wTfunKau47EL2dhHKon"
	
	var m02147483647H12147483646Hprv = "xprvA1RpRA33e1JQ7ifknakTFpgNXPmW2YvmhqLQYMmrj4xJXXWYpDPS3xz7iAxn8L39njGVyuoseXzU6rcxFLJ8HFsTjSyQbLYnMpCqE2VbFWc"
	var m02147483647H12147483646Hpub = "xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL"
	
	var m02147483647H12147483646H2prv = "xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j"
	var m02147483647H12147483646H2pub = "xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt"
	
	//var pubkey0H = Bip32.publicChildFromPublicParent(keysm.M, 2147483648 + 0)		
	
	var keysm = Bip32.createMasterKeys(seed)
	expect(Bip32.serializeKey(keysm.m)).toEqual(mprv)
	expect(Bip32.serializeKey(keysm.M)).toEqual(mpub)
	
	
	var prvm0 = Bip32.privateChildFromPrivateParent(keysm.m, 0)
	var pubm0 = Bip32.publicKeyFromPrivateKey(prvm0)
	var pubkeym0 = Bip32.publicChildFromPublicParent(keysm.M, 0)
	var pubChildm0 = Bip32.publicChildFromPrivateParent(keysm.m, 0)
	expect(Bip32.serializeKey(prvm0)).toEqual(m0prv)
	expect(Bip32.serializeKey(pubm0)).toEqual(m0pub)
	expect(Bip32.serializeKey(pubkeym0)).toEqual(m0pub)
	expect(Bip32.serializeKey(pubChildm0)).toEqual(m0pub)
	
	
	var prvm02147483647H = Bip32.privateChildFromPrivateParent(prvm0, 2147483648 + 2147483647)
	var pubm02147483647H = Bip32.publicKeyFromPrivateKey(prvm02147483647H)
	var pubkeym02147483647H = Bip32.publicChildFromPublicParent(pubm0, 2147483648 + 2147483647) //Should not be able to derive hardened key
	var pubChildm02147483647H = Bip32.publicChildFromPrivateParent(prvm0, 2147483648 + 2147483647)
	expect(Bip32.serializeKey(prvm02147483647H)).toEqual(m02147483647Hprv)
	expect(Bip32.serializeKey(pubm02147483647H)).toEqual(m02147483647Hpub)
	expect(pubkeym02147483647H).toEqual(undefined)
	expect(Bip32.serializeKey(pubChildm02147483647H)).toEqual(m02147483647Hpub)
	
	
	
	var prvm02147483647H1 = Bip32.privateChildFromPrivateParent(prvm02147483647H, 1)
	var pubm02147483647H1 = Bip32.publicKeyFromPrivateKey(prvm02147483647H1)
	var pubkeym02147483647H1 = Bip32.publicChildFromPublicParent(pubm02147483647H, 1)
	var pubChildm02147483647H1 = Bip32.publicChildFromPrivateParent(prvm02147483647H, 1)
	expect(Bip32.serializeKey(prvm02147483647H1)).toEqual(m02147483647H1prv)
	expect(Bip32.serializeKey(pubm02147483647H1)).toEqual(m02147483647H1pub)
	expect(Bip32.serializeKey(pubkeym02147483647H1)).toEqual(m02147483647H1pub)
	expect(Bip32.serializeKey(pubChildm02147483647H1)).toEqual(m02147483647H1pub)



	var prvm02147483647H12147483646H = Bip32.privateChildFromPrivateParent(prvm02147483647H1, 2147483648 + 2147483646)
	var pubm02147483647H12147483646H = Bip32.publicKeyFromPrivateKey(prvm02147483647H12147483646H)
	var pubkeym02147483647H12147483646H = Bip32.publicChildFromPublicParent(pubm02147483647H1, 2147483648 + 2147483646) //Should not be able to derive hardened key
	var pubChildm02147483647H12147483646H = Bip32.publicChildFromPrivateParent(prvm02147483647H1, 2147483648 + 2147483646)
	expect(Bip32.serializeKey(prvm02147483647H12147483646H)).toEqual(m02147483647H12147483646Hprv)
	expect(Bip32.serializeKey(pubm02147483647H12147483646H)).toEqual(m02147483647H12147483646Hpub)
	expect(pubkeym02147483647H12147483646H).toEqual(undefined)
	expect(Bip32.serializeKey(pubChildm02147483647H12147483646H)).toEqual(m02147483647H12147483646Hpub)
	
	
	var prvm02147483647H12147483646H2 = Bip32.privateChildFromPrivateParent(prvm02147483647H12147483646H, 2)
	var pubm02147483647H12147483646H2 = Bip32.publicKeyFromPrivateKey(prvm02147483647H12147483646H2)
	var pubkeym02147483647H12147483646H2 = Bip32.publicChildFromPublicParent(pubm02147483647H12147483646H, 2)
	var pubChildm02147483647H12147483646H2 = Bip32.publicChildFromPrivateParent(prvm02147483647H12147483646H, 2)
	expect(Bip32.serializeKey(prvm02147483647H12147483646H2)).toEqual(m02147483647H12147483646H2prv)
	expect(Bip32.serializeKey(pubm02147483647H12147483646H2)).toEqual(m02147483647H12147483646H2pub)
	expect(Bip32.serializeKey(pubkeym02147483647H12147483646H2)).toEqual(m02147483647H12147483646H2pub)
	expect(Bip32.serializeKey(pubChildm02147483647H12147483646H2)).toEqual(m02147483647H12147483646H2pub)
	
	
})


test('Check BIP32 test vector 3', () => {
	var seed = "4b381541583be4423346c643850da4b320e46a87ae3d2a4e6da11eba819cd4acba45d239319ac14f863b8d5ab5a0d0c64d2e8a1e7d1457df2e5a3c51c73235be"
	
	var mprv = "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6"
	var mpub = "xpub661MyMwAqRbcEZVB4dScxMAdx6d4nFc9nvyvH3v4gJL378CSRZiYmhRoP7mBy6gSPSCYk6SzXPTf3ND1cZAceL7SfJ1Z3GC8vBgp2epUt13"
	
	var m0Hprv = "xprv9uPDJpEQgRQfDcW7BkF7eTya6RPxXeJCqCJGHuCJ4GiRVLzkTXBAJMu2qaMWPrS7AANYqdq6vcBcBUdJCVVFceUvJFjaPdGZ2y9WACViL4L"
	var m0Hpub = "xpub68NZiKmJWnxxS6aaHmn81bvJeTESw724CRDs6HbuccFQN9Ku14VQrADWgqbhhTHBaohPX4CjNLf9fq9MYo6oDaPPLPxSb7gwQN3ih19Zm4Y"
	
	var keysm = Bip32.createMasterKeys(seed)
	expect(Bip32.serializeKey(keysm.m)).toEqual(mprv)
	expect(Bip32.serializeKey(keysm.M)).toEqual(mpub)
	
	var prvm0H = Bip32.privateChildFromPrivateParent(keysm.m, 2147483648)
	var pubm0H = Bip32.publicKeyFromPrivateKey(prvm0H)
	var pubkeym0H = Bip32.publicChildFromPublicParent(keysm.M, 2147483648) //Should not be able to derive hardened key
	var pubChildm0H = Bip32.publicChildFromPrivateParent(keysm.m, 2147483648)
	expect(Bip32.serializeKey(prvm0H)).toEqual(m0Hprv)
	expect(Bip32.serializeKey(pubm0H)).toEqual(m0Hpub)
	expect(pubkeym0H).toEqual(undefined)
	expect(Bip32.serializeKey(pubChildm0H)).toEqual(m0Hpub)
	
})