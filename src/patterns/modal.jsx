import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

//IMPORTING STYLESHEET

import "../styles/patterns/modal.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { isValidUrl } from "../utils/Bidify";

//IMPORTING MEDIA ASSETS

import close from "../assets/icons/close.svg";
import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";
import NoImage from "../assets/placeholders/nft-placeholder.svg"
import NFTPortImage from "../assets/placeholders/nftport.gif"
import FleekImage from "../assets/placeholders/fleek.gif"
import IpfsImage from "../assets/placeholders/ipfs.gif"

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, transform: "translate(-50%, -50%) scale(0.5)" },
  visible: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: { delay: 0.1 },
  },
  exit: { opacity: 0, transform: "translate(-50%, -50%) scale(0)" },
};

export const CollectionModal = (props) => {
  const { isModal, setIsModal, image, name, owner, renderCreateForm } = props;
  const [isPlay, setIsPlay] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [imageUrl, SetImageUrl] = useState("");
  const videoRef = useRef(null);
  const [loadingImage, setLoadingImage] = useState(true)
  const [placeholder, setPlaceholder] = useState("")
  console.log("image", image);
  useEffect(() => {
    const setImage = async () => {
      const arr = image.split("url=");
      let displayImg = "";
      if (arr.length > 1) {
        SetImageUrl(decodeURIComponent(arr[1]))
        displayImg = decodeURIComponent(arr[1]);
      } else {
        SetImageUrl(image);
        displayImg = image;
      }
      try {
        const response = await fetch(displayImg);
        const contentType = response.headers.get("content-type");
        if (contentType.includes("video")) {
          setIsVideo(true);
        }
      } catch (e) {
        setIsVideo(false);
      }
    }
    setImage();
    if (image.includes('storage.googleapis.com')) return setPlaceholder(NFTPortImage)
    if (image.includes('fleek.co')) return setPlaceholder(FleekImage)
    return setPlaceholder(IpfsImage)
  }, [setIsModal, image]);

  const handlePlay = () => {
    if (videoRef) videoRef.current.play();
    setIsPlay(true);
  };

  const handlePause = () => {
    if (videoRef) videoRef.current.pause();
    setIsPlay(false);
  };

  const renderModalHeader = (
    <div className="modal_header">
      <div>
        <Text variant="primary" style={{ marginBottom: 5 }}>
          Create Auction
        </Text>
      </div>
      <img
        src={close}
        alt="close"
        width={24}
        onClick={() => setIsModal(false)}
      />
    </div>
  );

  const renderBody = (
    <div className="modal_body">
      <div className="image text-center">
        {isVideo ? (
          <>
            <video ref={videoRef} loop>
              <source src={image} type="video/mp4" />
              <source src={image} type="video/ogg" />
              <source src={image} type="video/mov" />
              <source src={image} type="video/avi" />
              <source src={image} type="video/wmv" />
              <source src={image} type="video/flv" />
              <source src={image} type="video/webm" />
              <source src={image} type="video/mkv" />
              <source src={image} type="video/avchd" />
            </video>
            {
              <img
                src={isPlay ? pauseImg : playImg}
                alt="button"
                className="video_nav_btn"
                onClick={!isPlay ? () => handlePlay() : () => handlePause()}
              />
            }
          </>
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
      <Text variant="primary" style={{ fontSize: 20, lineHeight: "27px" }}>
        {name}
      </Text>
      <Text>
        By: {`${owner?.slice(0, 6)}...${owner?.slice(owner?.length - 6)}`}
      </Text>
    </div>
  );

  const renderCreateModal = (
    <AnimatePresence exitBeforeEnter>
      {isModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderModalHeader}
            {renderBody}
            {renderCreateForm}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return <>{renderCreateModal}</>;
};

export const LiveAuctionModal = (props) => {
  const { isModal, setIsModal, currentBid, nextBid, handleBidMethod, symbol, endingPrice } = props;
  const [yourBid, setYourBid] = useState(nextBid);
  const renderModalHeader = (
    <div className="modal_header">
      <div></div>
      <img
        src={close}
        alt="close"
        width={24}
        onClick={() => setIsModal(false)}
      />
    </div>
  );
  useEffect(() => {
    setYourBid(nextBid)
  }, [nextBid])
  const renderForm = (
    <div className="create_form">
      <Text>Current bid</Text>
      <div className="form_input">
        <section>{currentBid ? currentBid : 0}</section>
        <Text style={{ color: "#F79420" }}>{symbol}</Text>
      </div>
      <Text>Minimum bid</Text>
      <div className="form_input">
        <section>{nextBid}</section>
        <Text style={{ color: "#F79420" }}>{symbol}</Text>
      </div>
      <Text>Buy it now price</Text>
      <div className="form_input">
        <section>{endingPrice !== '0' ? endingPrice : "N/A"}</section>
        <Text style={{ color: "#F79420" }}>{symbol}</Text>
      </div>
      <Text>Your bid</Text>
      <div className="form_input">
        <input type="number" defaultValue={nextBid} onChange={(e) => {setYourBid(e.target.value)}} />
        <Text style={{ color: "#F79420" }}>{symbol}</Text>
      </div>
      <Button variant="primary" type="submit" onClick={() => handleBidMethod(yourBid)}>
        Place Your Bid
      </Button>
    </div>
  );

  const renderBidModal = (
    <AnimatePresence>
      {isModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderModalHeader}
            {renderForm}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return <>{renderBidModal}</>;
};
