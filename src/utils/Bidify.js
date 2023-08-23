/* eslint-disable */

/**
 * Bidify js methods
 * @module Bidify
 * @example
 * const Bidify = require('~/plugins/bidify.js')
 *
 * Bidify.bid(...)
 */

import Web3 from "web3";
import { Contract, ethers } from "ethers";
import { FetchWrapper } from "use-nft";
import detectEthereumProvider from "@metamask/detect-provider";
import { BIDIFY, BIT, ERC721, ERC1155, URLS, getLogUrl, snowApi, baseUrl } from "./config";
import axios from 'axios';
import { string } from "yup/lib/locale";
import { get } from "lodash-es";
//import { settings } from '@/utils/settings'

// let web3;
const chainId = Promise.resolve(
  new Web3(window.ethereum).eth.getChainId((res) => {
    return res;
  })
);
// let Bidify;
//const web3 = new Web3(window?.ethereum);
async function getBidify() {
  const chainID = await web3.eth.getChainId();
  return new web3.eth.Contract(BIDIFY.abi, BIDIFY.address[chainID]);
}

// Promise.resolve(web3.eth.getChainId()).then((_chainId) => {
//   web3 = new Web3(window.ethereum);
//   chainId = _chainId;
//   Bidify = new web3.eth.Contract(BIDIFY.abi, BIDIFY.address[chainId]);
// });
const web3 = new Web3(window.ethereum);
let from = window?.ethereum?.selectedAddress;

const ERC721JSON = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "owner", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "operator", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "_approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/**
 * Instantiates the Bidify contract
 * @name init
 * @method
 * @memberof Bidify
 */

//  export async function init () {
//    const provider = await detectEthereumProvider()

//    web3 = await new Web3(provider)

//    Bidify = await new web3.eth.Contract(BIDIFY_JSON, settings.bidifyAddress)
//  }

/**
 * Called when a user connects or changes accounts
 * @name onAccountChange
 * @method
 * @param {object} $store context
 * @param {string} type of wallet connection (browser, walletlink, walletconnect)
 * @param {array} accounts returned from request_accounts
 * @param {object} web3 provider returned from wallet provider
 * @memberof Bidify
 */

//  export async function onAccountChange ({ $store, type, accounts, web3Provider }) {
//    const account = window?.ethereum?.selectedAddress;

//   //  const ready = $store.state.localStorage.status

//   //  const keepDisconnect = ready ? $store.state.localStorage.wallet.keepDisconnect : null

//    // no account, trigger a disconnect (this will fire on startup)
//    if (!account || keepDisconnect) {

//      return
//    }

//    from = account
//    web3 = web3Provider

//    Bidify = await new web3.eth.Contract(BIDIFY_JSON, settings.bidifyAddress)

//    // const raw = await getETHBalance(account)
//    const raw = await web3.eth.getBalance(account)

//    const balance = web3.utils.fromWei(raw, 'ether')

//    // set balance
//    $store.commit('wallets/balance', { type: 'ether', balance })

//    // connect wallet
//    $store.commit('wallets/connected', { account, type })

//    // save provider type
//    $store.commit('localStorage/provider', type)
//  }

// Convert to a usable value
export function atomic(value, decimals) {
  let quantity = decimals;
  if (value.indexOf(".") !== -1) {
    quantity -= value.length - value.indexOf(".") - 1;
  }
  let atomicized = value.replace(".", "");
  for (let i = 0; i < quantity; i++) {
    atomicized += "0";
  }
  while (atomicized[0] === "0") {
    atomicized = atomicized.substr(1);
  }
  return Web3.utils.toBN(atomicized);
}

// Convert to a human readable value
export function unatomic(value, decimals) {
  value = value.padStart(decimals + 1, "0");
  let temp =
    value.substr(0, value.length - decimals) +
    "." +
    value.substr(value.length - decimals);
  while (temp[0] === "0") {
    temp = temp.substr(1);
  }
  while (temp.endsWith("0")) {
    temp = temp.slice(0, -1);
  }
  if (temp.endsWith(".")) {
    temp = temp.slice(0, -1);
  }
  if (temp.startsWith(".")) {
    temp = "0" + temp;
  }

  if (temp == "") {
    return "0";
  }
  return temp;
}

// When currency is null, it's ETH

// Get the decimals of an ERC20
export async function getDecimals(currency) {
  const web3 = new Web3(window.ethereum);
  if (!currency) {
    return 18;
  }

  return await new web3.eth.Contract(BIT.abi, currency).methods
    .decimals()
    .call();
}

// Get how many decimals Bidify uses with an ERC20
async function getDecimalAccuracy(currency) {
  return Math.min(await getDecimals(currency), 4);
}

// Get the 'price unit' of an ERC20
// An ERC20 which Bidify uses 4 decimals of has a price unit of 0.0001
// Every price value will be a multiple of this

// async function getPriceUnit(currency) {
//   let decimals = await getDecimals(currency);
//   if (!currency) {
//     currency = "0x0000000000000000000000000000000000000000";
//   }
//   return unatomic(await Bidify.methods.getPriceUnit(currency).call(), decimals);
// }

// Get the minimum price Bidify will use in relation to an ERC20
export async function getMinimumPrice(currency) {
  const Bidify = await getBidify();
  let decimals = await getDecimals(currency);
  if (!currency) {
    currency = "0x0000000000000000000000000000000000000000";
  }
  return unatomic(
    new web3.utils.BN(await Bidify.methods.getPriceUnit(currency).call())
      .mul(new web3.utils.BN(20))
      .toString(),
    decimals
  );
}

/**
 * Get all NFTs for the current user as a list of [{ platform, token }]
 * Only works for accounts who have received <1000 NFTs (including repeats)
 * Chunk the getPastLogs call or limit to a specific NFT platform to avoid this
 * @name getNFTs
 * @method
 * @memberof Bidify
 */

export async function getNFTs(chainId, account) {
  // const from = account;
  const from = account;
  const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
  const topic = "0x" + from.split("0x")[1].padStart(64, "0")
  let logs = []
  let logs_1155 = []
  if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 5 || chainId === 9001 || chainId === 1285 || chainId === 100) {
    const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_2_opr=and&topic2=${chainId === 9001 || chainId === 100 ? topic.toLowerCase() : topic}&apikey=${snowApi[chainId]}`).catch(e => console.log("getNft error"))
    // return console.log("return value", ret)
    logs = ret.data.result
  }

  // Get all transfers to us
  else logs = await web3.eth.getPastLogs({
    fromBlock: 0,
    toBlock: "latest",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      // "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
      // null,
      null,
      "0x" + from.split("0x")[1].padStart(64, "0"),
    ],
  }).catch(e => {
    console.log("error on getpastlogs", e.message)
  });
  // Filter to just tokens which are still in our custody
  const res = [];
  const ids = {};
  for (let log of logs) {
    // console.log(log)
    if (log.topics[3] !== undefined) {
      try {
        let platform = log.address;
        let token = log.topics[3];
        let owner = await new web3.eth.Contract(ERC721.abi, platform).methods
          .ownerOf(token)
          .call();
        if (owner.toLowerCase() !== from.toLowerCase()) {
          continue;
        }

        let jointID = platform + token;

        if (ids[jointID]) {
          continue;
        }
        token = parseInt(token, 16).toString();
        ids[jointID] = true;
        res.push({ platform, token, amount: 1 });
      } catch (e) {
        console.log(e)
        continue;
      }
    } else {
      continue;
    }
  }
  if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 5 || chainId === 9001 || chainId === 1285 || chainId === 100) {
    const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}topic0=0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62&topic0_3_opr=and&topic3=${chainId === 9001 || chainId === 100 ? topic.toLowerCase() : topic}&apikey=${snowApi[chainId]}`)
    logs_1155 = ret.data.result
  }
  else logs_1155 = await web3.eth.getPastLogs({
    fromBlock: 0,
    toBlock: "latest",
    topics: [
      // "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
      null,
      null,
      "0x" + from.split("0x")[1].padStart(64, "0"),
    ],
  });
  for (let log of logs_1155) {
    if (log.topics[3] !== undefined) {
      try {
        let platform = log.address;
        const decodeData = web3.eth.abi.decodeParameters(['uint256', 'uint256'], log.data);
        let token = web3.utils.toHex(decodeData[0]);
        let amount = await new web3.eth.Contract(ERC1155.abi, platform).methods
          .balanceOf(from, decodeData[0])
          .call();
        if (amount < 1) continue;
        // if (owner.toLowerCase() !== from.toLowerCase()) {
        //   continue;
        // }

        let jointID = platform + token;

        if (ids[jointID]) {
          continue;
        }
        token = token.toString();
        ids[jointID] = true;
        res.push({ platform, token, amount });
      } catch (e) {
        continue;
      }
    } else {
      continue;
    }
  }
  return res;
}

/**
 * Wallet signature for approval for Bidify contract
 * @name signList
 * @method
 * @param {string} currency to utilize
 * @param {string} platform to list
 * @param {string} token to list
 * @param {string} price to list at (minimum starting price)
 * @param {string} days to list for
 * @param {boolean} allowMarketplace
 * @memberof Bidify
 */

export async function signList({
  platform,
  token,
  isERC721,
  chainId,
  account,
  library
}) {
  const erc721 = new ethers.Contract(platform, ERC721.abi, library.getSigner())
  const erc1155 = new ethers.Contract(platform, ERC1155.abi, library.getSigner())
  let tx;
  const gasLimit = 1000000;
  
  if (!isERC721) {
    const isApproved = await erc1155.isApprovedForAll(account, BIDIFY.address[chainId])
    if (!isApproved) {
      tx = chainId === 137 ?
      await erc1155
        .setApprovalForAll(BIDIFY.address[chainId], true, { gasLimit }) :
      await erc1155
        .setApprovalForAll(BIDIFY.address[chainId], true)
    }
  }
  if (isERC721) {
    tx = chainId === 137 ?
      await erc721
        .approve(BIDIFY.address[chainId], token, {gasLimit}) :
      await erc721
        .approve(BIDIFY.address[chainId], token)
  }
  if (tx) {
    await tx.wait()
  }
}

/**
 * Lists an ERC721 token with Bidify
 * @name list
 * @method
 * @param {string} currency to utilize
 * @param {string} platform to list
 * @param {string} token to list
 * @param {string} price to list at (minimum starting price)
 * @param {string} days to list for
 * @param {boolean} allowMarketplace
 * @memberof Bidify
 */

export async function list({
  currency,
  platform,
  token,
  price,
  endingPrice,
  days,
  image,
  name,
  description,
  metadataUrl,
  chainId,
  account,
  library,
  isERC721,
  setTransaction
}) {
  let decimals = await getDecimals(currency);
  if (!currency) {
    currency = "0x0000000000000000000000000000000000000000";
  }
  const Bidify = new ethers.Contract(
    BIDIFY.address[chainId],
    BIDIFY.abi,
    library.getSigner()
  );
  // return token;
  const tokenNum = token;
  const gasLimit = 1000000;
  try {
    const totalCount = await getLogs(chainId)
    const tx = chainId === 137 ? await Bidify
      .list(
        currency,
        platform,
        tokenNum.toString(),
        atomic(price.toString(), decimals).toString(),
        atomic(endingPrice.toString(), decimals).toString(),
        Number(days),
        isERC721,
        "0x0000000000000000000000000000000000000000",
        { gasLimit }
      ) :
      await Bidify
        .list(
          currency,
          platform,
          tokenNum.toString(),
          atomic(price.toString(), decimals).toString(),
          atomic(endingPrice.toString(), decimals).toString(),
          Number(days),
          isERC721,
          "0x0000000000000000000000000000000000000000"
        )
    const ret = await tx.wait()
    setTransaction(ret)
    if (chainId === 43114 || chainId === 137 || chainId === 5 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100 || chainId === 61)
      while (await getLogs(chainId) === totalCount) {
        console.log()
        console.log("while loop")
      }
    // const listCnt = await getLogs()
    const newId = totalCount
    // await delay()
    const listingDetail = await getDetailFromId(newId, chainId, account, image, metadataUrl, name, token, platform, isERC721, library)
    await axios.post(`${baseUrl}/auctions`, { ...listingDetail, image_cache: image })
  } catch (error) {
    return console.log("list error", error)
  }
}

/**
 * Gets a listing from Bidify
 * @name getListing
 * @method
 * @param {string} id of listing
 * @memberof Bidify
 */

export async function getListing(id) {
  const chain_id = await chainId;
  const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chain_id]));
  const Bidify = await getBidify();

  const nullIfZeroAddress = (value) => {
    if (value === "0x0000000000000000000000000000000000000000") {
      return null;
    }
    return value;
  };

  let raw = await Bidify.methods.getListing(id).call();
  let currency = nullIfZeroAddress(raw.currency);

  let highBidder = nullIfZeroAddress(raw.highBidder);
  let currentBid = raw.price;
  let nextBid = await Bidify.methods.getNextBid(id).call();
  let endingPrice = raw.endingPrice;
  let decimals = await getDecimals(currency);
  if (currentBid === nextBid) {
    currentBid = null;
  } else {
    currentBid = unatomic(currentBid, decimals);
  }

  let referrer = nullIfZeroAddress(raw.referrer);
  let marketplace = nullIfZeroAddress(raw.marketplace);

  let bids = [];
  for (let bid of await web3.eth.getPastLogs({
    fromBlock: 0,
    toBlock: "latest",
    address: BIDIFY.address[chain_id],
    topics: [
      "0xdbf5dea084c6b3ed344cc0976b2643f2c9a3400350e04162ea3f7302c16ee914",
      "0x" + new web3.utils.BN(id).toString("hex").padStart(64, "0"),
    ],
  })) {
    bids.push({
      bidder: "0x" + bid.topics[2].substr(-40),
      price: unatomic(
        new web3.utils.BN(bid.data.substr(2), "hex").toString(),
        decimals
      ),
    });
  }

  return {
    id,
    creator: raw.creator,
    currency,
    platform: raw.platform,
    token: raw.token,

    highBidder,
    currentBid,
    nextBid: unatomic(nextBid, decimals),
    endingPrice: unatomic(endingPrice.toString(), decimals),

    referrer,
    allowMarketplace: raw.allowMarketplace,
    marketplace,

    endTime: raw.endTime,
    paidOut: raw.paidOut,
    isERC721: raw.isERC721,

    bids,
  };
}

/**
 * Signs the bid before calling contract
 * @name signBid
 * @method
 * @param {string} id of listing to bid on
 * @memberof Bidify
 */

export const signBid = async (id, amount, chainId, account, library) => {
  // return;
  const from = account;
  const chain_id = chainId;
  let currency
  if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) currency = (await getListingDetail(id, chainId, library)).currency;
  else currency = (await getListing(id.toString())).currency
  let balance;
  const web3 = new Web3(window.ethereum)
  if (!currency) {
    balance = await web3.eth.getBalance(from)
    balance = web3.utils.fromWei(balance)
  }
  else {
    const Bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
    const erc20 = new ethers.Contract(currency, BIT.abi, library.getSigner());
    const decimals = await getDecimals(currency);
    balance = unatomic(
      await erc20.balanceOf(from),
      decimals
    );
    let allowance = await erc20.allowance(from, BIDIFY.address[chain_id])
    // console.log("allowence", Number(allowance));
    if (Number(amount) >= Number(allowance)) {
      if (chainId === 137) {
        const gasLimit = 1000000
        const tx = await erc20
          .approve(Bidify._address, atomic(balance, decimals), {gasLimit})
          await tx.wait()
      } else {
        const tx = await erc20
          .approve(Bidify._address, atomic(balance, decimals))
          await tx.wait()
      }
    }
  }

  if (Number(balance) < Number(amount)) {
    throw new Error("low_balance");
  }
}

/**
 * Bids on a listing via Bidify
 * @name bid
 * @method
 * @param {string} id of listing to bid on
 * @memberof Bidify
 */

export const bid = async (id, amount, chainId, account, library, setTransaction) => {
  let currency
  if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) currency = (await getListingDetail(id, chainId, library)).currency;
  else currency = (await getListing(id.toString())).currency
  let decimals = await getDecimals(currency)
  const Bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
  const from = account
  // return console.log("handle bid", id, atomic(amount, decimals).toString())
  // console.log("amount", atomic(amount, decimals).toString())
  
  const gasLimit = 1000000
  if (currency) {
    const tx = chainId === 137 ? await Bidify
      .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString(), { gasLimit }) :
      await Bidify
        .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString())
    const ret = await tx.wait()
    setTransaction(ret)
  } else {
    // const nextamount = await Bidify.getNextBid(id)
    // console.log("amount and next Bid", atomic(amount, decimals).toString(), nextamount.toString())
    const tx = chainId === 137 ? await Bidify
      .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString(), {
        from: from,
        value: atomic(amount, decimals).toString(),
      }) :
      await Bidify
        .bid(id, "0x0000000000000000000000000000000000000000", atomic(amount, decimals).toString(), {
          from: from,
          value: atomic(amount, decimals).toString()
        })
    const ret = await tx.wait()
    setTransaction(ret)
  }
}

/**
 * Gets all all recent listings from Bidify
 * @name getListings
 * @method
 * @param {string} creator
 * @param {string} platform
 * @memberof Bidify
 */

export async function getListings(creator, platform) {
  let creatorTopic = null;
  if (creator) {
    creatorTopic = "0x" + creator.substr(2).toLowerCase().padStart(64, "0");
  }

  let platformTopic = null;
  if (platform) {
    platformTopic = "0x" + platform.substr(2).toLowerCase().padStart(64, "0");
  }

  let res = [];
  for (let listing of await web3.eth.getPastLogs({
    fromBlock: 0,
    toBlock: "latest",
    address: settings.bidifyAddress,
    topics: [
      "0x5424fbee1c8f403254bd729bf71af07aa944120992dfa4f67cd0e7846ef7b8de",
      null,
      creatorTopic,
      platformTopic,
    ],
  })) {
    res.push(new web3.utils.BN(listing.topics[1].substr(2), "hex").toString());
  }
  return res;
}

/**
 * ...
 * @name finish
 * @method
 * @param {string} id of listing
 * @memberof Bidify
 */

export async function finish(id) {
  const Bidify = await getBidify();
  await Bidify.methods
    .finish(id)
    .send({ from: window?.ethereum?.selectedAddress });
}


/**
 * Gets eth balance of current connected account
 * @name getETHBalance
 * @method
 * @memberof Bidify
 */

export async function getETHBalance() {
  const Bidify = await getBidify();
  return unatomic((await Bidify.methods.balanceOf(from).call()) || "0", 18);
}

/**
 * ...
 * @name withdraw
 * @method
 * @memberof Bidify
 */

export async function withdraw() {
  const Bidify = await getBidify();
  await Bidify.methods.withdraw(from).send({ from });
}

/**
 * ...
 * @name mintNFT
 * @method
 * @memberof Bidify
 */
export async function mintNFT(token) {
  await new web3.eth.Contract(TestNFTJSON, settings.nftAddress).methods
    ._mint(token)
    .send({ from });

  return { token, address: settings.nftAddress };
}


const TestNFTJSON = [
  {
    inputs: [
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "_mintActual",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "_mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const isValidUrl = urlString=> {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

export const getBalance = async (account, chainId) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
  let _balance = await web3.eth.getBalance(account); //Will give value in.
  _balance = web3.utils.fromWei(_balance);
  return _balance;
}

export const getFetchValues = async (val, chainId, account) => {
  let provider;
  switch (chainId) {
    case 1:
      provider = new ethers.providers.InfuraProvider(
        "mainnet",
        "0c8149f8e63b4b818d441dd7f74ab618"
      );
      break;
    case 5:
      provider = new ethers.providers.InfuraProvider(
        "goerli",
        "0c8149f8e63b4b818d441dd7f74ab618"
      );
      break;
    default:
      if (!URLS[chainId]) console.log("select valid chain");
      else provider = new ethers.providers.JsonRpcProvider(URLS[chainId])
  }

  const ethersConfig = {
    ethers: { Contract },
    provider: provider,
  };


  const fetcher = ["ethers", ethersConfig];

  function ipfsUrl(cid, path = "") {
    return `https://dweb.link/ipfs/${cid}${path}`;
  }

  function imageurl(url) {
    // const string = url;
    const check = url.substr(16, 4);
    if(url.includes('ipfs://')) return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    if(url.includes('https://ipfs.io/ipfs/')) return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    if (check === "ipfs") {
      const manipulated = url.substr(16, 16 + 45);
      return "https://dweb.link/" + manipulated;
    } else {
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    }
  }

  // function jsonurl(url) {
  //   return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  // }

  const fetchWrapper = new FetchWrapper(fetcher
    , {
      jsonProxy: (url) => {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      },
      imageProxy: (url) => {
        if (chainId === 137 || chainId === 43114 || chainId === 42161 || chainId === 56) {
          return url;
        } else {
          return imageurl(url);
        }
      },
      ipfsUrl: (cid, path) => {
        return ipfsUrl(cid, path);
      },
    }
  );
  let result = {}; 
  try {
    result = await fetchWrapper.fetchNft(val?.platform, val?.token);
    // const urlParams = new URLSearchParams(result.image);
    const finalResult = {
      ...result,
      // newImageUrl: imageurl(result.image),
      platform: val?.platform,
      token: val?.token,
      isERC721: result.owner ? true : false,
      owner: result.owner ? result.owner : account,
      amount: val?.amount
    };
    return finalResult;
  } catch (e) {
    const finalResult = {
      // newImageUrl: imageurl(result.image),
      platform: val?.platform,
      token: val?.token,
      isERC721: result && result.owner ? true : false,
      owner: result && result.owner ? result.owner : account,
      amount: val?.amount
    };
    return finalResult;
  }
};

export const getDetails = async (chainId, account) => {
  let getNft;

  let results = [];
    try {
      getNft = await getNFTs(chainId, account);
    } catch (e) {
      console.log(e.message)
    }
    for (var i = 0; i < getNft?.length; i++) {
      try {
        const res = await getFetchValues(getNft[i], chainId, account);
        results.push(res);
      } catch (error) {
        console.log(error)
      }
    }
  // setUpdate(results.map(item => { return { ...item, network: chainId } }))
  return results.map(item => { return { ...item, network: chainId } })
};

export const getListingDetail = async (id, chainId, library) => {
  const bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
  let raw = await bidify.getListing(id.toString())
  while (raw.creator === "0x0000000000000000000000000000000000000000") {
    raw = await bidify.getListing(id.toString())
  }
  // console.log("raw", raw)
  const nullIfZeroAddress = (value) => {
    if (value === "0x0000000000000000000000000000000000000000") {
      return null;
    }
    return value;
  };

  let currency = nullIfZeroAddress(raw.currency);

  let highBidder = nullIfZeroAddress(raw.highBidder);
  let currentBid = raw.price;
  let nextBid = await bidify.getNextBid(id);
  let endingPrice = raw.endingPrice;
  let decimals = await getDecimals(currency);
  if (currentBid === nextBid) {
    currentBid = null;
  } else {
    currentBid = unatomic(currentBid.toString(), decimals);
  }

  let referrer = nullIfZeroAddress(raw.referrer);
  let marketplace = nullIfZeroAddress(raw.marketplace);

  let bids = [];
  const web3 = new Web3(window.ethereum)
  const topic1 = "0x" + new web3.utils.BN(id).toString("hex").padStart(64, "0");
  const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}topic0=0xdbf5dea084c6b3ed344cc0976b2643f2c9a3400350e04162ea3f7302c16ee914&topic0_1_opr=and&topic1=${chainId === 9001 || chainId === 100 ? topic1.toLowerCase() : topic1}&apikey=${snowApi[chainId]}`)
  const logs = ret.data.result
  // console.log("bid logs", logs)
  for (let bid of logs) {
    bids.push({
      bidder: "0x" + bid.topics[2].substr(-40),
      price: unatomic(
        new web3.utils.BN(bid.data.substr(2), "hex").toString(),
        decimals
      ),
    });
  }
  return {
    id,
    creator: raw.creator,
    currency,
    platform: raw.platform,
    token: raw.token.toString(),

    highBidder,
    currentBid,
    nextBid: unatomic(nextBid.toString(), decimals),
    endingPrice: unatomic(endingPrice.toString(), decimals),

    referrer,
    allowMarketplace: raw.allowMarketplace,
    marketplace,

    endTime: raw.endTime.toString(),
    paidOut: raw.paidOut,
    isERC721: raw.isERC721,

    bids,
  };
}

export const getLogs = async (chainId) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
  const topic0 =
    "0x5424fbee1c8f403254bd729bf71af07aa944120992dfa4f67cd0e7846ef7b8de";
  let logs = [];
  try {
    if (chainId === 43114 || chainId === 137 || chainId === 5 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
      let url = `${getLogUrl[chainId]}&fromBlock=0&${chainId === 9001 || chainId === 100 || chainId === 61 ? 'toBlock=latest&' : ''}address=${BIDIFY.address[chainId]}&topic0=${topic0}`;
      if (chainId !== 9001 && chainId !== 100) {
        url += `&apikey=${snowApi[chainId]}`;
      }
      const ret = await axios.get(url)
      logs = ret.data.result
    }
    else logs = await web3.eth.getPastLogs({
      fromBlock: "earliest",
      toBlock: "latest",
      address: BIDIFY.address[chainId],
      topics: [topic0],
    });
  } catch (e) {
    console.log(e.message)
  }

  return logs.length;
}

export const getDetailFromId = async (id, chainId, account, image, metadataUrl, name, token, platform, isERC721, library) => {
  let detail
  if (chainId === 43114 || chainId === 137 || chainId === 5 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
    detail = await getListingDetail(id, chainId, library)
  }
  else detail = await getListing(id)
  const fetchedValue = await getFetchValues(detail, chainId, account)
  const { owner, descrption } = fetchedValue;
  return { owner, ...detail, network: chainId, image, metadataUrl, name, token, platform, isERC721, descrption }

}

export const handleIpfsImageUrl = (displayImg) => {
  if (displayImg.includes('ipfs://')) {
    return displayImg.replace('ipfs://', 'https://ipfs.io/ipfs/');
  } else {
    return displayImg;
  }
}