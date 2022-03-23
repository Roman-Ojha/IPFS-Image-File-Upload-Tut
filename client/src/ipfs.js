import IPFS from "ipfs-api";
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

// here we are making the instance of ipfs api

export default ipfs;
