const path = require('path')
const fs = require('fs-extra')
const solc = require('solc')

const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)

const contractFileName = 'Campaign.sol'
const contractPath = path.resolve(__dirname, 'contracts', contractFileName)
const source = fs.readFileSync(contractPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    [contractFileName]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[contractFileName]

fs.ensureDirSync(buildPath)

for (let contract in output) {
  fs.outputJSONSync(path.resolve(buildPath, contract + '.json'), output[contract])
}
