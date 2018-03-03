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
	expect(keysm.m).toEqual(mprv)
	expect(keysm.M).toEqual(mpub)
	
	var keysm0H = Bip32.privateChildFromPrivateParent(keysm.m, keysm.c, 2147483648 + 0)
	expect(keysm0H.m).toEqual(m0Hprv)
	expect(keysm0H.M).toEqual(m0Hpub)
	
	var keysm0H1 = Bip32.privateChildFromPrivateParent(keysm0H.m, keysm0H.c, 1)
	expect(keysm0H1.m).toEqual(m0H1prv)
	expect(keysm0H1.M).toEqual(m0H1pub)
	
	var keysm0H12H = Bip32.privateChildFromPrivateParent(keysm0H1.m, keysm0H1.c, 2147483648 + 2)
	expect(keysm0H12H.m).toEqual(m0H12Hprv)
	expect(keysm0H12H.M).toEqual(m0H12Hpub)
	
	var keysm0H12H2 = Bip32.privateChildFromPrivateParent(keysm0H12H.m, keysm0H12H.c, 2)
	expect(keysm0H12H2.m).toEqual(m0H12H2prv)
	expect(keysm0H12H2.M).toEqual(m0H12H2pub)
	
	var keysm0H12H21000000000 = Bip32.privateChildFromPrivateParent(keysm0H12H2.m, keysm0H12H2.c, 1000000000)
	expect(keysm0H12H21000000000.m).toEqual(m0H12H21000000000prv)
	expect(keysm0H12H21000000000.M).toEqual(m0H12H21000000000pub)
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
	
	
	var keysm = Bip32.createMasterKeys(seed)
	expect(keysm.m).toEqual(mprv)
	expect(keysm.M).toEqual(mpub)
	
	var keysm0 = Bip32.privateChildFromPrivateParent(keysm.m, keysm.c, 0)
	expect(keysm0.m).toEqual(m0prv)
	expect(keysm0.M).toEqual(m0pub)
	
	var keysm02147483647H = Bip32.privateChildFromPrivateParent(keysm0.m, keysm0.c, 2147483648 + 2147483647)
	expect(keysm02147483647H.m).toEqual(m02147483647Hprv)
	expect(keysm02147483647H.M).toEqual(m02147483647Hpub)
	
	var keysm02147483647H1 = Bip32.privateChildFromPrivateParent(keysm02147483647H.m, keysm02147483647H.c, 1)
	expect(keysm02147483647H1.m).toEqual(m02147483647H1prv)
	expect(keysm02147483647H1.M).toEqual(m02147483647H1pub)
	
	var m02147483647H12147483646H = Bip32.privateChildFromPrivateParent(keysm02147483647H1.m, keysm02147483647H1.c, 2147483648 + 2147483646)
	expect(m02147483647H12147483646H.m).toEqual(m02147483647H12147483646Hprv)
	expect(m02147483647H12147483646H.M).toEqual(m02147483647H12147483646Hpub)
	
	var m02147483647H12147483646H2 = Bip32.privateChildFromPrivateParent(m02147483647H12147483646H.m, m02147483647H12147483646H.c, 2)
	expect(m02147483647H12147483646H2.m).toEqual(m02147483647H12147483646H2prv)
	expect(m02147483647H12147483646H2.M).toEqual(m02147483647H12147483646H2pub)
	
	
})


test('Check BIP32 test vector 3', () => {
	var seed = "4b381541583be4423346c643850da4b320e46a87ae3d2a4e6da11eba819cd4acba45d239319ac14f863b8d5ab5a0d0c64d2e8a1e7d1457df2e5a3c51c73235be"
	
	var mprv = "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6"
	var mpub = "xpub661MyMwAqRbcEZVB4dScxMAdx6d4nFc9nvyvH3v4gJL378CSRZiYmhRoP7mBy6gSPSCYk6SzXPTf3ND1cZAceL7SfJ1Z3GC8vBgp2epUt13"
	
	var m0Hprv = "xprv9uPDJpEQgRQfDcW7BkF7eTya6RPxXeJCqCJGHuCJ4GiRVLzkTXBAJMu2qaMWPrS7AANYqdq6vcBcBUdJCVVFceUvJFjaPdGZ2y9WACViL4L"
	var m0Hpub = "xpub68NZiKmJWnxxS6aaHmn81bvJeTESw724CRDs6HbuccFQN9Ku14VQrADWgqbhhTHBaohPX4CjNLf9fq9MYo6oDaPPLPxSb7gwQN3ih19Zm4Y"
	
	var keysm = Bip32.createMasterKeys(seed)
	expect(keysm.m).toEqual(mprv)
	expect(keysm.M).toEqual(mpub)
	
	var keysm0H = Bip32.privateChildFromPrivateParent(keysm.m, keysm.c, 2147483648)
	expect(keysm0H.m).toEqual(m0Hprv)
	expect(keysm0H.M).toEqual(m0Hpub)
	
})