import web3 from './web3'
import compiledFactory from './build/CampaignFactory.json'
import { bscTestNetContractAddress } from './config'

const instance = new web3.eth.Contract(compiledFactory.abi, bscTestNetContractAddress)

export default instance
