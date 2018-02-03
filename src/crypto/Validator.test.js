import { Validator } from './Validator';

test('Check that valid addresses are validated correctly', () => {
	
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i")).toBe(true)
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62j")).toBe(false)
    expect(Validator.validateBitcoinAddress("1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nK9")).toBe(true)
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62X")).toBe(false)
	expect(Validator.validateBitcoinAddress("1ANNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i")).toBe(false)
	expect(Validator.validateBitcoinAddress("1A Na15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i")).toBe(false)
	expect(Validator.validateBitcoinAddress("BZbvjr")).toBe(false)
	expect(Validator.validateBitcoinAddress("i55j")).toBe(false)
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62!")).toBe(false)
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62iz")).toBe(false)
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62izz")).toBe(false)
	expect(Validator.validateBitcoinAddress("1Q1pE5vPGEEMqRcVRMbtBK842Y6Pzo6nJ9")).toBe(false)
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62I")).toBe(false)
	
	//Non base 58
	expect(Validator.validateBitcoinAddress("1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW620")).toBe(false)
	
})
