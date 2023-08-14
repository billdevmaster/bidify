import React, { useEffect, useContext, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { FetchWrapper } from "use-nft";
import Web3 from "web3";
import { Contract, ethers } from "ethers";

//STYLESHEET

import "../styles/pages/homepage.scss";

//IMPORTING PATTERNS

import ScreenTemplate from "../patterns/screenTemplate";
import Footer from "../patterns/footer";
import CollectionCard from "../patterns/collectionCard";
import Header from "../patterns/header";
import NoArtifacts from "../patterns/noArtifacts";
import Loader from "../patterns/loader";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";

//IMPORTING UTILITY PACKAGES

import { ERC721, ERC1155, URLS, baseUrl, snowApi, getLogUrl } from "../utils/config";
import axios from "axios";
import { getNftsByMoralis } from "../utils/NFTFetcher";

const Collection = () => {
  //INITIALIZING HOOKS

  const { userDispatch } = useContext(UserContext);

  const { active, chainId, account } = useWeb3React();

  // const [update, setUpdate] = useState([])

  const [nfts, setNfts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [chainChanged, setChainChanged] = useState(false);
  //HANDLING METHODS
  const getCollection = async () => {
    userDispatch({
      type: "MY_COLLECTIONS",
      payload: { results: undefined },
    });
    if (chainId === 137 || chainId === 43114 || chainId === 42161 || chainId === 56) {
      const resp = await getNftsByMoralis(account, cursor, chainId);
      setCursor(resp.cursor)
      let tmpNfts = [...nfts];
      
      for (let i = 0; i < resp.nfts.length; i++) {
        const retdata = resp.nfts[i];
        tmpNfts.push(retdata);
      }
      setNfts([ ...tmpNfts ]);
      
      // while (cursor != null) {
      //   const resp = await getNftsByMoralis("0xd8da6bf26964af9d7eed9e03e53415d37aa96045", cursor, chainId);
      //   cursor = resp.cursor;
      //   console.log(cursor);
      //   if (resp.nfts) {
      //     let tmpNfts = [...nfts];
      //     for (let i = 0; i < resp.nfts.length; i++) {
      //       const retdata = resp.nfts[i];
      //       tmpNfts.push(retdata);
      //     }
      //     setNfts([ ...tmpNfts ]);
      //   }
      // }
    } else {
      const newData = await getDetails();
      console.log(newData);
    }
    setChainChanged(false);
    // const response = await axios.get(`${baseUrl}/collection`, { params: { chainId, owner: account } })
    // const results = response.data
    // if (results.length === 0) {
    //   console.log("getting from blockchain")
    //   const newData = await getDetails()
    //   userDispatch({
    //     type: "MY_COLLECTIONS",
    //     payload: { results: newData },
    //   });
    //   await handleUpdate(newData)
    // }
    // else {
    //   console.log("here")
    //   userDispatch({
    //     type: "MY_COLLECTIONS",
    //     payload: { results, isCollectionFetched: true },
    //   });
    //   // setTimeout(async() => {
    //   await updateDatabase(results)
    //   // }, 3000)

    // }
  }

  const loadNftsFromMoralis = async () => {
    const resp = await getNftsByMoralis(account, cursor, chainId);
    setCursor(resp.cursor)
    let tmpNfts = [...nfts];
    
    for (let i = 0; i < resp.nfts.length; i++) {
      const retdata = resp.nfts[i];
      tmpNfts.push(retdata);
    }
    setNfts([ ...tmpNfts ]);
  }

  useEffect(() => {
    if (nfts.length === 0 && chainChanged) {
      getCollection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts])

  // const updateDatabase = async (results) => {
  //   // console.log("before updateing", results, results.length)
  //   console.log("updating database")
  //   const newData = await getDetails()
  //   console.log("updated database")
  //   // console.log("comparing", newData, newData.length)
  //   // if(newData.length === )
  //   // const dataToAdd = newData.filter(nft => results.includes(nft))
  //   // const dataToRemove = results.filter(nft => newData.includes(nft))
  //   // console.log(dataToAdd, dataToRemove)
  //   await axios.put(`${baseUrl}/admincollection`, { data: newData, chainId, owner: account })
  //   // if(dataToAdd.length) await axios.post(`${baseUrl}/admincollection`, dataToAdd)
  //   // if(dataToRemove.length) await axios.delete(`${baseUrl}/admincollection`, dataToRemove)
  // }
  useEffect(() => {
    if (account !== undefined) {
      setNfts([]);
      setChainChanged(true);
    } else {
      console.log("connect wallet to view collections");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  // const account = "0x0B172a4E265AcF4c2E0aB238F63A44bf29bBd158";

  const getFetchValues = async (val) => {
    let provider;
    switch (chainId) {
      case 1:
        provider = new ethers.providers.InfuraProvider(
          "mainnet",
          "0c8149f8e63b4b818d441dd7f74ab618"
        );
        break;
      case 4:
        provider = new ethers.providers.InfuraProvider(
          "rinkeby",
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

    // function imageurl(url) {
    //   // const string = url;
    //   const check = url.substr(16, 4);
    //   if(url.includes('ipfs://')) return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    //   if(url.includes('https://ipfs.io/ipfs/')) return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    //   if (check === "ipfs") {
    //     const manipulated = url.substr(16, 16 + 45);
    //     return "https://dweb.link/" + manipulated;
    //   } else {
    //     return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    //   }
    // }

    // function jsonurl(url) {
    //   return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    // }

    const fetchWrapper = new FetchWrapper(fetcher
      , {
        jsonProxy: (url) => {
          return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        },
        imageProxy: (url) => {
          // return imageurl(url);
          return url;
        },
        ipfsUrl: (cid, path) => {
          return ipfsUrl(cid, path);
        },
      }
    );
    
    const result = await fetchWrapper.fetchNft(val?.platform, val?.token);
    
    // const urlParams = new URLSearchParams(result.image);
    const finalResult = {
      ...result,
      // newImageUrl: imageurl(result.image),
      platform: val?.platform,
      token: val?.token,
      isERC721: result.owner ? true : false,
      owner: result.owner ? result.owner : account
    };
    return finalResult;
  };

  const getDetails = async () => {
    let getNft;

    let results = [];
      try {
        getNft = await getNFTs();
      } catch (e) {
        console.log(e.message)
      }
      for (var i = 0; i < getNft?.length; i++) {
        try {
          const res = await getFetchValues(getNft[i]);
          results.push(res);
        } catch (error) {
          console.log(error)
        }
      }
    // setUpdate(results.map(item => { return { ...item, network: chainId } }))
    userDispatch({
      type: "MY_COLLECTIONS",
      payload: { results, isCollectionFetched: true },
    });
    return results.map(item => { return { ...item, network: chainId } })
  };

  async function getNFTs() {
    // const from = account;
    const from = account;
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    const topic = "0x" + from.split("0x")[1].padStart(64, "0")
    let logs = []
    let logs_1155 = []
    if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
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
          res.push({ platform, token });
        } catch (e) {
          continue;
        }
      } else {
        continue;
      }
    }
    if (chainId === 43114 || chainId === 137 || chainId === 56 || chainId === 9001 || chainId === 1285 || chainId === 100) {
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
          let owner = await new web3.eth.Contract(ERC1155.abi, platform).methods
            .balanceOf(from, decodeData[0])
            .call();
          if (owner < 1) continue;
          // if (owner.toLowerCase() !== from.toLowerCase()) {
          //   continue;
          // }
  
          let jointID = platform + token;
  
          if (ids[jointID]) {
            continue;
          }
          token = token.toString();
          ids[jointID] = true;
          res.push({ platform, token });
        } catch (e) {
          continue;
        }
      } else {
        continue;
      }
    }
    return res;
  }

  const renderCards = (
    <div className="card_wrapper">
      {nfts?.map((lists, index) => {
        return (
          <CollectionCard
            {...lists}
            getDetails={() => { }}
            getFetchValues={getFetchValues}
            key={index.toString()}
          />
        );
      })}

      {cursor && (
        <>
          <button onClick={loadNftsFromMoralis}>show more</button>
        </>
      )}
    </div>
  );

  const renderScreen = (
    <div className="collection_screen">
      <Header
        title="My NFTs"
        description="view and list your NFTs for auction"
      />
      {!active ? <NoArtifacts title="Bidify is not connected to Ethereum." /> : nfts ? (
        nfts?.length > 0 ? (
          <>
            {renderCards}
          </>
        ) : (
          <NoArtifacts title="There are currently no compatible NFTs in this wallet" />
        )
      ) : (
        <Loader />
      )}
    </div>
  );
  const handleUpdate = async (update) => {
    // console.log("updating", update)
    if (update.length === 0) return
    await axios.post(`${baseUrl}/admincollection`, update)
    // console.log('update result', res)
  }

  return (
    <>
      <ScreenTemplate>
        {account === "0x72003c9EB53B7d9CAf538F38f3CaAC75787Ea869" && <button onClick={handleUpdate}>update database</button>}
        {renderScreen}
        <Footer />
      </ScreenTemplate>
    </>
  );
};

export default Collection;
