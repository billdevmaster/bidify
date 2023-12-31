import * as actionType from "../types";

const initialState = {
  isConnected: false,
  isSidebar: false,
};

const UserReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionType.CONNECT:
      return {
        ...state,
        isConnected: payload?.isConnected,
      };
    case actionType.SIDEBAR:
      return {
        ...state,
        isSidebar: payload?.isSidebar,
      };
    case actionType.LIVE_AUCTION_NFT:
      return {
        ...state,
        liveAuctions: payload?.results,
        isLiveAuctionFetched: payload?.isFetched,
        userBiddings: payload?.userBiddings,
      };
    case actionType.MY_COLLECTIONS:
      if(state.myCollections === payload?.results) return state;
      return {
        ...state,
        myCollections: payload?.results,
        isCollectionFetched: payload?.isCollectionFetched,
      };
    case actionType.SEARCH_AUCTIONS:
      let result = [];
      if (state?.liveAuctions) {
        state?.liveAuctions?.forEach((auction) => {
          if (auction.name.toLowerCase().match(payload.keyword.toLowerCase())) {
            result.push(auction);
          }
        });

        return {
          ...state,
          searchResults: result,
        };
      }

      return {
        ...state,
      };
    case actionType.RESET:
      return {
        ...state,
        searchResults: undefined,
      };
    case actionType.SET_BALANCE:
      return {
        ...state,
        balance: payload?.balance
      }
    default:
      return { ...state };
  }
};

export default UserReducer;
