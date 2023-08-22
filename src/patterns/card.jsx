import React, { useEffect, useState, useContext } from "react";
import Countdown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
//IMPORTING STYLESHEET

import "../styles/patterns/card.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { LiveAuctionModal } from "./modal";
import Prompt from "./prompt";
import { UserContext } from "../store/contexts";

//IMPORTING MEDIA ASSETS

import lock from "../assets/icons/lock.svg";
import NFTPortImage from "../assets/placeholders/nftport.gif"
import FleekImage from "../assets/placeholders/fleek.gif"
import IpfsImage from "../assets/placeholders/ipfs.gif"
import NoImage from "../assets/placeholders/nft-placeholder.svg"

//IMPORTING UTILITY PACKGAES

import { isValidUrl, getBalance, getDetailFromId } from "../utils/Bidify";
import { getTokenSymbol } from "../utils/getCurrencySymbol";
import { baseUrl, BIDIFY, getSymbol } from "../utils/config";
import axios from "axios";
import { ethers } from "ethers"
import PromptFinish from "./promptFinish";
import { signBid, bid } from "../utils/Bidify";

const Card = (props) => {
  const { userDispatch } = useContext(UserContext);
  const { name, creator, image, currentBid, nextBid, endTime, id, currency, getLists, highBidder, endingPrice, token, platform, isERC721, metadataUrl } =
    props;
  const imageToDisplay = image
  const { account, chainId, library } = useWeb3React();
  const history = useHistory();
  const isUser = account?.toLocaleLowerCase() === creator?.toLocaleLowerCase();
  const isHighBidder = account?.toLocaleLowerCase() === highBidder?.toLocaleLowerCase();
  const [isModal, setIsModal] = useState(false);
  const [processContent, setProcessContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isVideo, setIsVideo] = useState(false);
  const [imageUrl, SetImageUrl] = useState("");
  const [symbol, setSymbol] = useState('');
  const [transaction, setTransaction] = useState()
  const [latestDetail, setLatestDetail] = useState(props)
  const [loadingImage, setLoadingImage] = useState(true)
  const [placeholder, setPlaceholder] = useState("")
  useEffect(() => {
    
    if (imageToDisplay.includes('storage.googleapis.com')) {
      setPlaceholder(NFTPortImage)
    } else if (imageToDisplay.includes('fleek.co')) {
      setPlaceholder(FleekImage)
    } else {
      setPlaceholder(IpfsImage)
    }
    
    const arr = imageToDisplay.split("url=");
    let displayImg = "";
    if (arr.length > 1) {
      SetImageUrl(decodeURIComponent(arr[1]))
      displayImg = decodeURIComponent(arr[1]);
    } else {
      SetImageUrl(imageToDisplay);
      displayImg = imageToDisplay;
    }
    fetch(displayImg).then(response => {
      const contentType = response.headers.get("content-type");
      if (contentType.includes("video")) {
        setIsVideo(true);
      }
    }).catch(e => {
      setIsVideo(false);
    })

  }, [imageToDisplay, setPlaceholder])
  // useEffect(() => {
  //   if (isSuccess) getLists();

  //   return () => setIsSuccess(false);
  // }, [isSuccess]);

  useEffect(() => {
    const getData = async () => {
      if (currency === "0x0000000000000000000000000000000000000000" || !currency) {
        setSymbol(getSymbol(chainId))
        return
      }
      const res = await getTokenSymbol(currency);
      setSymbol(res);
    }
    getData()
  }, [chainId, currency]);

  const handleAbort = () => {
    setIsSuccess(false)
    setIsFinished(false)
    getLists()
  }
  const handleFinishAuction = async () => {
    // return setIsFinished(true)
    setIsLoading(true);
    
    try {
      const gasLimit = 1000000;
      const Bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
      const tx = chainId === 137 ? await Bidify.finish(id.toString(), { gasLimit }) : await Bidify.finish(id.toString())
      const ret = await tx.wait()
      setTransaction(ret)
      // await new new Web3(window.ethereum).eth.Contract(
      //   BIDIFY.abi,
      //   BIDIFY.address[chainId]
      // ).methods
      //   .finish(id.toString())
      //   .send({ from: account });
      let updateData = await getDetailFromId(id, chainId, account, imageUrl, metadataUrl, name, token, platform, isERC721, library);
      while (!updateData.paidOut) {
        updateData = await getDetailFromId(id, chainId, account, imageUrl, metadataUrl, name, token, platform, isERC721, library)
      }
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      setIsLoading(false);
      setIsFinished(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    } finally {
      const balance = await getBalance(account);
      userDispatch({
        type: "SET_BALANCE",
        payload: { balance },
      });
    }
  };

  const handleBidMethod = async (amount) => {
    // return console.log(id, "0x0000000000000000000000000000000000000000", atomic(amount, 18).toString())
    setIsModal(false);
    setIsLoading(true);
    setProcessContent(
      "Please allow https://Bidify.org permission within your wallet when prompted there will be a small fee for this"
    );
    try {
      await signBid(id, amount, chainId, account, library)
      setProcessContent(
        "Confirm the transaction of your bid amount, there will be a small network fee for this."
      );
      await bid(id, amount, chainId, account, library, setTransaction);
      while (account !== (await getDetailFromId(id, chainId, account, imageUrl, metadataUrl, name, token, platform, isERC721, library)).highBidder) {
        console.log("in while loop")
      }
      // console.log("out of loop")
      const updateData = await getDetailFromId(id, chainId, account, imageUrl, metadataUrl, name, token, platform, isERC721, library);
      setLatestDetail(updateData)
      await axios.put(`${baseUrl}/auctions/${id}`, updateData)
      setIsLoading(false);
      
      if (amount >= endingPrice && Number(endingPrice) !== 0) setIsFinished(true)
      else setIsSuccess(true);
    } catch (error) {
      console.log(error);
      if (error === "low_balance") {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(
          "Check your balance.your balance is low to bid for this NFT"
        );
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      } else {
        setIsLoading(false);
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    } finally {
      const balance = await getBalance(account);
      userDispatch({
        type: "SET_BALANCE",
        payload: { balance },
      });
    }
  };

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          <div className="card_content_details">
            <div className="block_left">
              {
                currentBid ?
                  <Text variant="primary" style={{ color: "#F79420" }}>
                    Sold out for {currentBid} {symbol}
                  </Text> :
                  <Text style={{ fontSize: 12 }}>Not sold out</Text>
              }
            </div>
          </div>
          {/* {isUser ? ( */}
          <Button
            variant="secondary"
            // style={{ pointerEvents: !isUser && "none" }}
            onClick={() => handleFinishAuction()}
          >
            Finish auction
          </Button>
          {/* ) : ( */}
          {/* <p></p> */}
          {/* )} */}
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <div className="card_content_details">
            <div className="block_left">
              <Text variant="primary" style={{ color: "#F79420" }}>
                {(currentBid !== nextBid && currentBid !== null) ? currentBid : '0'} {symbol}
              </Text>
              <Text style={{ fontSize: 12 }}>Current Bid</Text>
            </div>
            <div className="block_right">
              <Text variant="primary" style={{ color: "#FB5050" }}>
                {days} : {hours} : {minutes} : {seconds}
              </Text>
              <Text style={{ fontSize: 12 }}>Bidding Ends In</Text>
            </div>
          </div>
          <Button
            variant="secondary"
            style={{ pointerEvents: (isUser || isHighBidder) && "none" }}
            onClick={isUser ? null : () => setIsModal(true)}
          >
            {isUser ? (
              <img src={lock} alt="lock" width={14} />
            ) : (
              !isHighBidder ? "Place Your Bid" : "You are the highest bidder"
            )}
          </Button>
        </>
      );
    }
  };

  const renderImage = (
    <div
      className="card_image cursor"
      onClick={() => history.push(`/nft_details/auction/${id}`)}
    >
      {isVideo ? (
        <video controls loop>
          <source src={imageToDisplay} type="video/mp4" />
          <source src={imageToDisplay} type="video/ogg" />
          <source src={imageToDisplay} type="video/mov" />
          <source src={imageToDisplay} type="video/avi" />
          <source src={imageToDisplay} type="video/wmv" />
          <source src={imageToDisplay} type="video/flv" />
          <source src={imageToDisplay} type="video/webm" />
          <source src={imageToDisplay} type="video/mkv" />
          <source src={imageToDisplay} type="video/avchd" />
        </video>
      ) : (
        <>
          {loadingImage && <img className="placeholder" src={placeholder} alt="" />}
          <LazyLoadImage
            effect="blur"
            src={isValidUrl(imageUrl) ? `https://img-cdn.magiceden.dev/rs:fill:400:0:0:0/plain/${imageUrl}` : imageUrl}
            alt="art"
            placeholder={
              <div></div>
            }
            onError={(e) => {setPlaceholder(NoImage)}}
            afterLoad={() => {setLoadingImage(false)}}
          />
        </>
      )}
    </div>
  );

  const renderContent = (
    <div className="card_content">
      <div
        className="overlay"
        onClick={() => history.push(`/nft_details/auction/${id}`)}
      ></div>
      <Text variant="primary" className="title">
        {name}
      </Text>
      <Text>
        By: #
        {`${creator?.slice(0, 4)}...${creator?.slice(creator?.length - 4)}`}
      </Text>

      <Countdown date={new Date(endTime * 1000)} renderer={renderer} />
    </div>
  );

  const renderCard = (
    <div className="card">
      {renderImage}
      {renderContent}
    </div>
  );

  return (
    <>
      {renderCard}
      <LiveAuctionModal
        {...props}
        symbol={symbol}
        handleBidMethod={handleBidMethod}
        isModal={isModal}
        setIsModal={setIsModal}
      />
      <Prompt isModal={isLoading} processContent={processContent} />
      <Prompt
        variant="success"
        isModal={isSuccess}
        handleAbort={handleAbort}
        successContent="Congratulations, you have successfully bid on this NFT, you are the current highest bidder…. Good luck"
      />
      <PromptFinish
        variant="success"
        isModal={isFinished}
        handleAbort={handleAbort}
        highBidder={latestDetail.highBidder}
        seller={latestDetail.creator}
        chainId={chainId}
        name={latestDetail.name}
        transaction={transaction}
      />
      <Prompt variant="error" isModal={isError} errorMessage={errorMessage} />
    </>
  );
};

export default Card;
