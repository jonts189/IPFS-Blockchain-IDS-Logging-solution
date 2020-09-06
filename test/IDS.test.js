const IDS = artifacts.require("IDS");

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('IDS', (accounts) => {
	let ids

	before(async () => {
		ids = await IDS.deployed()
	})

	describe('deployment', async () => {

		it('deploys successfully', async () => {
			ids = await IDS.deployed()
			const address = ids.address
			console.log(address)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
			assert.notEqual(address, 0x0)
		})
	})

	describe('storage', async () => {
			it('updates the IDSHash', async () => {
			let IDSHash
			IDSHash = 'abc123456'
			await ids.set(IDSHash)
			const result = await ids.get()
			assert.equal(result, IDSHash)
		})
	})
})