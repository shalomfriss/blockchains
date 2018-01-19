import { CryptoUtil } from './CryptoUtil';

test("Check that random number is 256 bits and is random", () => {
	var rando = CryptoUtil.getRandomNumber()
	var rando2 = CryptoUtil.getRandomNumber()
	
	expect(rando).not.toEqual(rando2)
	expect(rando.length).toBe(64)	
})

test('check base 64 private key', () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var b64 = CryptoUtil.base64(pkey, false)
	
	expect(b64).toEqual("EYTNLN1kDKQs/DoJHFHVSbLwFtRUsndAGcKy0uCFKf0=")
})

test('check unbase 64 private key', () => {
	var pkey = "1184CD2CDD640CA42CFC3A091C51D549B2F016D454B2774019C2B2D2E08529FD"
	var b64 = CryptoUtil.base64(pkey, false)
	
	var unkey = CryptoUtil.unbase64(b64)
	expect(unkey).toEqual(pkey)
})	