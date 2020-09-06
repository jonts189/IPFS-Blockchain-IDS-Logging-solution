import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import IDS from '../abis/IDS.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //Get the account
  //Get the network
  //Get the Smart Contract
  // --> ABI IDS.abi
  // --> Address: networkData.address 
  //Get the IDSHash

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const networkData = IDS.networks[networkId]
    if(networkData) {
      //Fetch Contract
      const abi = IDS.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract })
      console.log(contract)
      const IDSHash = await contract.methods.get().call()
      this.setState({ IDSHash })
    } else {
      window.alert('Smart contract not deployed to detected network')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      buffer: null,
      contract: null,
      IDSHash: ''
       };
    }

    async loadWeb3() {
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
      } if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
      } else {
          window.alert('MetaMask not found')
      }
    }

  captureFile = (event) => {
  event.preventDefault()
//Process File for IPFS
  console.log(event.target.files)
  const file = event.target.files[0]
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {
    console.log('buffer', Buffer(reader.result))
    this.setState({ buffer: Buffer(reader.result) })
  }
}

//Example URL: https://ipfs.infura.io/ipfs/
// Example Path for Log File: ""QmaDfHjzkzEvoi1oa2dCP2MzpokMwAWLstGFP36Kw8acj1""
// Full Path: https://ipfs.infura.io/ipfs/QmaDfHjzkzEvoi1oa2dCP2MzpokMwAWLstGFP36Kw8acj1
onSubmit = (event) => {
  event.preventDefault()
  console.log("Submitting the Form...")
  ipfs.add(this.state.buffer, (error, result) => {
    console.log('IPFS Result', result)
    const IDSHash = result[0].hash
    if(error) {
      console.error(error)
      return
    }
    //Store the file Hash on blockchain:
    this.state.contract.methods.set(IDSHash).send({ from: this.state.account }).then((r) => {
      this.setState({ IDSHash })
    })
  }) 
}

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://ethereum.org/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Snort IDS Log Tracker
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/QmcEemmwjiee7qcVbCFpKjfKXy1YT1QEgrfrDHgLd4Qt4G`} />
                </a>
                <br/>
                <br/>
                <h1>Snort IDS Log Tracker</h1>
                <br/>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
                <br/>
                <br/>
                  <tr>
                   <td><h2>Log of files uploaded</h2></td>
                  </tr>
                  <tr>
                   <td><a href={`https://ipfs.infura.io/ipfs/${this.state.IDSHash}`}>Most up to date Snort log</a></td>
                 </tr>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
