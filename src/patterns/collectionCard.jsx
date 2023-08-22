import React, { useEffect, useRef, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Web3 from "web3";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import fleekStorage from '@fleekhq/fleek-storage-js'

//IMPORTING STYLESHEET

import "../styles/patterns/card.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { CollectionModal } from "./modal";
import Prompt from "./prompt";

//IMPORTING MEDIA ASSETS

import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";
import NFTPortImage from "../assets/placeholders/nftport.gif"
import FleekImage from "../assets/placeholders/fleek.gif"
import IpfsImage from "../assets/placeholders/ipfs.gif"
import NoImage from "../assets/placeholders/nft-placeholder.svg"

//IMPORTING UTILITY PACKGAES

import { getSymbol, URLS } from "../utils/config";
import { isValidUrl, list, signList, getDetails } from "../utils/Bidify";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
// import { getBase64ImageBuffer } from "../utils/NFTFetcher";
import { UserContext } from "../store/contexts";

const CollectionCard = (props) => {
  const { name, description, image, platform, amount, token, isERC721, token_uri, flipRefresh } = props;
  const { userDispatch } = useContext(UserContext);
  const { chainId, account, library } = useWeb3React();
  const videoRef = useRef(null);

  // const account = '0x0B172a4E265AcF4c2E0aB238F63A44bf29bBd158'

  const [processContent, setProcessContent] = useState("");
  const [transaction, setTransaction] = useState();
  const [imageUrl, SetImageUrl] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [symbol, setSymbol] = useState("")
  const [loadingImage, setLoadingImage] = useState(true)
  const [placeholder, setPlaceholder] = useState("")
  const history = useHistory()
  // const { userDispatch } = useContext(UserContext);
  useEffect(() => {
    
    if (image.includes('storage.googleapis.com')) {
      setPlaceholder(NFTPortImage)
    } else if (image.includes('fleek.co')) {
      setPlaceholder(FleekImage)
    } else {
      setPlaceholder(IpfsImage)
    }
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
  }, [image, setPlaceholder])
  const initialValues = {
    price: "0",
    endingPrice: "0",
    days: "",
    platform,
    token,
    // currency: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    currency: null,
  };

  useEffect(() => {
    if (account) {
      setSymbol(getSymbol(chainId))
    }
  }, [account, chainId])
  const validationSchema = Yup.object({
    price: Yup.number()
      .typeError("price must be a number")
      .min(0.000001, "price must be greater than 0")
      .required("This field is required"),
    endingPrice: Yup.number()
      .typeError("price must be a number")
      .required("This field is required"),
    days: Yup.number()
      .typeError("days must be a number")
      .min(1, "days must be greater than one day")
      .max(10, "days should be less than 10 days")
      .required("This field is required"),
  });
  const onSubmit = async (values, onSubmitProps) => {
    setIsModal(false);
    setIsLoading(true);
    const { currency, platform, token, price, endingPrice, days } = values;
    // return console.log(atomic(price.toString(), 18).toString(), atomic(endingPrice.toString(), 18).toString(),)
    setProcessContent(
      "Please allow https://bidify.org permission within your wallet when prompted, there will be a small fee for this…"
    );
    try {
      // check if approved already.
      await signList({ platform, token, isERC721, chainId, account, library });
      setProcessContent(
        "Confirm the second transaction to allow your NFT to be listed, there will be another small network fee."
      );
      await list({ currency, platform, token, price, endingPrice, days, image: imageUrl, name, metadataUrl: token_uri, description, chainId, account, library, isERC721, setTransaction });
      // const response = await axios.get(`${baseUrl}/collection`, { params: { chainId, owner: account } })
      // const results = response.data
      // userDispatch({
      //   type: "MY_COLLECTIONS",
      //   payload: { results, isCollectionFetched: true },
      // });
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        flipRefresh()
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    } finally {
      onSubmitProps.setSubmitting(false);
      onSubmitProps.resetForm();
      updateBalance();
    }
  };

  const updateBalance = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    let _balance = await web3.eth.getBalance(account); //Will give value in.
    _balance = web3.utils.fromWei(_balance);
    // setBalance(_balance)
    userDispatch({
        type: "SET_BALANCE",
        payload: { balance: _balance },
      });
  }

  const renderCreateForm = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="create_form">
          <Text>Initial Bid Amount</Text>
          <div className="form_input">
            <Field type="number" name="price" id="price" />
            <Text style={{ color: "#F79420" }}>{symbol}</Text>
          </div>
          <ErrorMessage
            name="price"
            component="p"
            className="error_input_msg"
          />
          <Text>Buy It Now Price</Text>
          <div className="form_input">
            <Field type="number" name="endingPrice" id="endingPrice" />
            <Text style={{ color: "#F79420" }}>{symbol}</Text>
          </div>
          <ErrorMessage
            name="endingPrice"
            component="p"
            className="error_input_msg"
          />
          <Text>Bidding Days</Text>
          <div className="form_input">
            <Field type="number" name="days" id="days" />
          </div>
          <ErrorMessage
            name="days"
            component="div"
            className="error_input_msg"
          />
          <Button variant="primary" type="submit">
            Create Auction
          </Button>
        </div>
      </Form>
    </Formik>
  );

  const handlePlay = () => {
    if (videoRef) videoRef.current.play();
    setIsPlay(true);
  };

  const handlePause = () => {
    if (videoRef) videoRef.current.pause();
    setIsPlay(false);
  };

  const renderImage = (
    <div className="card_image cursor" onClick={() => history.push(`/nft_details/${platform}/${token}`)}>
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
          {loadingImage && <img className='placeholder' src={placeholder} alt="" />}
          <LazyLoadImage
            effect="blur"
            src={isValidUrl(imageUrl) ? `https://img-cdn.magiceden.dev/rs:fill:400:0:0:0/plain/${imageUrl}` : imageUrl}
            alt="art"
            placeholder={<img src={NFTPortImage} alt="" />}
            onError={() => setPlaceholder(NoImage)}
            afterLoad={() => setLoadingImage(false)}
            width={"100%"}
            heigh={"100%"}
          />
        </>
      )}
    </div>
  );

  const renderContent = (
    <div className="card_content cursor">
      <div className="overlay" onClick={() => history.push(`/nft_details/${platform}/${token}`)}></div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text variant="primary" className="title">
          {name}
        </Text>
        {!isERC721 && (
          <Text variant="primary" className="title">
            {amount}
          </Text>
        )}
      </div>
      <div className="description_block">
        <Text className="description">{description}</Text>
      </div>
      <Button variant="secondary" onClick={(e) => setIsModal(true)}>
        Create Auction
      </Button>
    </div>
  );

  const renderCard = (
    <div className="card">
      {renderImage}
      {renderContent}
    </div>
  );

  const handleAbort = () => {
    setIsSuccess(false)
    getDetails()
  }

  return (
    <>
      {renderCard}
      <CollectionModal
        {...props}
        renderCreateForm={renderCreateForm}
        isModal={isModal}
        setIsModal={setIsModal}
        setIsLoading={setIsLoading}
        setIsError={setIsError}
      />
      <Prompt isModal={isLoading} processContent={processContent} />
      <Prompt
        variant="success"
        isModal={isSuccess}
        handleAbort={handleAbort}
        successContent={
          "Your NFT has now been listed and will be available to purchase on Bidify and all applicable Bidify powered sites and platforms."
        }
        name={name}
        transaction={transaction}
        chainId={chainId}
      />
      <Prompt variant="error" isModal={isError} />
    </>
  );
};

export default CollectionCard;
