const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  const abi = compiledFactory.abi
  const bytecode = compiledFactory.evm.bytecode.object

  factory = await new web3.eth.Contract(abi).deploy({
    data: bytecode
  }).send({
    from: accounts[0],
    gas: 2500000
  })

  // creates a new campaign inside campaign factory state data
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: 2500000
  })

  // gets the campaign and store its address
  const campaigns = await factory.methods.getDeployedCampaigns().call()
  campaignAddress = campaigns[0]

  // creates a contract reference using the code abi and the deployed address
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaign', () => {
  it('deploys the factory and campaign contracts with success', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('makes puts caller the caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(accounts[0], manager)
  })

  it('allows to contribute and puts the sender as one of the contributors', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200'
    })

    const isContributor = await campaign.methods.approvers(accounts[1]).call()
    assert(isContributor)
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '50'
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('allows a manager to create payment requests', async () => {
    await campaign.methods.createRequest('Buy new steel bars to create wings structure', '150', accounts[2]).send({
      from: accounts[0],
      gas: 2500000
    })

    const request = await campaign.methods.requests(0).call()
    assert.equal('Buy new steel bars to create wings structure', request.description)
  })
})
