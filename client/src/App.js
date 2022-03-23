import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from "./services/ipfs";
import Web3 from "web3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    account: null,
    contract: null,
    buffer: null,
    ipfsHash: "",
  };

  constructor(props) {
    super(props);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    // try {
    //   // Get network provider and web3 instance.
    //   const web3 = await getWeb3();
    //   // Use web3 to get the user's accounts.
    //   const accounts = await web3.eth.getAccounts();
    //   // Get the contract instance.
    //   const networkId = await web3.eth.net.getId();
    //   const deployedNetwork = SimpleStorageContract.networks[networkId];
    //   const instance = new web3.eth.Contract(
    //     SimpleStorageContract.abi,
    //     deployedNetwork && deployedNetwork.address
    //   );
    //   // Set web3, accounts, and contract to the state, and then proceed with an
    //   // example of interacting with the contract's methods.
    //   this.setState({ web3, accounts, contract: instance }, this.runExample);
    // } catch (error) {
    //   // Catch any errors for any of the above operations.
    //   alert(
    //     `Failed to load web3, accounts, or contract. Check console for details.`
    //   );
    //   console.error(error);
    // }
    try {
      // initializing web3, contract
      const web3 = new Web3("http://127.0.0.1:7545");
      const id = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[id];
      const contract = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork.address
      );
      const accounts = await web3.eth.getAccounts();
      const ipfsHash = await contract.methods.get().call();
      this.setState({ web3, account: accounts[0], contract, ipfsHash });
    } catch (err) {
      console.log(err);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  captureFile = (e) => {
    try {
      // to upload the file on ipfs we will use buffer module so that ipfs can understand
      // https://www.w3schools.com/nodejs/ref_buffer.asp#:~:text=The%20buffers%20module%20provides%20a,it%20using%20the%20require%20keyword.
      e.preventDefault();
      const file = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        this.setState({ buffer: Buffer(reader.result) });
      };
    } catch (err) {
      // console.log(err)
    }
  };
  onSubmit = (e) => {
    // here we will upload file to ipfs and store the file hash value on our blockchain smart contract
    e.preventDefault();
    ipfs.files.add(this.state.buffer, (err, result) => {
      // here we will add file on ipfs
      if (err) {
        console.error(err);
        return;
      }
      this.state.contract.methods
        .set(result[0].hash)
        .send({ from: this.state.account })
        .then((result) => {
          this.state.contract.methods
            .get()
            .call({ from: this.state.account })
            .then((ipfsHash) => {
              this.setState({ ipfsHash });
              console.log("contract ipfsHash", ipfsHash);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  render() {
    return (
      <div className="App">
        <h1>Your Image</h1>
        <p>This image is stored on IPFS & the Ethereum Blockchain</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="img" />
        <h2>Upload Image</h2>
        <form onSubmit={this.onSubmit}>
          <input type="file" placeholder="" onChange={this.captureFile} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
