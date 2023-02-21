// @ts-nocheck

import {useContractRead} from 'wagmi'
import goerliZoraAddresses from "@zoralabs/v3/dist/addresses/5.json";
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json";
import auctionABI from "@zoralabs/v3/dist/artifacts/ReserveAuctionListingEth.sol/ReserveAuctionListingEth.json"
import {BigNumber, utils} from "ethers"
import {ZDK, ZDKChain, ZDKNetwork} from '@zoralabs/zdk';
import {useAuth} from './useAuth';
import {useState, useEffect} from "react"

    const cleanIncomingAuctionData = (auctionData: any) => {
        const cleanedAuctionData = {
            seller: auctionData[0],
            reservePrice: formatBigNumber(auctionData[1]),
            sellerFundsRecipient: auctionData[2],
            highestBid: formatBigNumber(auctionData[3]),
            highestBidder: auctionData[4],
            duration: auctionData[5],
            startTime: auctionData[6],
            listingFeeRecipient: auctionData[7],
            firstBidTime: auctionData[8],
            listingFeeBps: auctionData[9]
        }
        return cleanedAuctionData
    }

    const formatBigNumber = (bigNumber: any) => {
        return utils.formatEther(BigNumber.from(bigNumber).toString())
    }

    const noLiveAuctionData: array = {
        seller: '0x0000000000000000000000000000000000000000',
        reservePrice: formatBigNumber("0"),
        sellerFundsRecipient: "0x0000000000000000000000000000000000000000",
        highestBid: formatBigNumber("0"),
        highestBidder: "0x0000000000000000000000000000000000000000",
        duration: "0",
        startTime: "0",
        listingFeeRecipient: "0x0000000000000000000000000000000000000000",
        firstBidTime: "0",
        listingFeeBps: "0"
    }

    const auctionExistsNotStartedData: array = {
        seller: '0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8',
        reservePrice: formatBigNumber("10000000000000000"),
        sellerFundsRecipient: "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8",
        highestBid: formatBigNumber("0"),
        highestBidder: "0x0000000000000000000000000000000000000000",
        duration: "0",
        startTime: "1676637573", // crazy number is 32507613573 less crazy number is 1676637573
        listingFeeRecipient: "0x0000000000000000000000000000000000000000",
        firstBidTime: "0",
        listingFeeBps: "0"
    }    

    const startedNoReservePriceYet: array = {
        seller: '0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8',
        reservePrice: formatBigNumber("10000000000000000"),
        sellerFundsRecipient: "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8",
        highestBid: formatBigNumber("0"),
        highestBidder: "0x0000000000000000000000000000000000000000",
        duration: "0",
        startTime: "1676446773", // already started
        listingFeeRecipient: "0x0000000000000000000000000000000000000000",
        firstBidTime: "0",
        listingFeeBps: "0"
    }        

    const gotFirstBidNotDone: array = {
        seller: '0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8',
        reservePrice: formatBigNumber("10000000000000000"),
        sellerFundsRecipient: "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8",
        highestBid: formatBigNumber("10000000000000000"),
        highestBidder: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
        duration: "36000000", // hasnt finished yet
        startTime: "1676446773", // already started
        listingFeeRecipient: "0x0000000000000000000000000000000000000000",
        firstBidTime: "1676446850", // hit bid
        listingFeeBps: "0"
    }     

    const auctionDoneNotSettled: array = {
        seller: '0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8',
        reservePrice: formatBigNumber("10000000000000000"),
        sellerFundsRecipient: "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8",
        highestBid: formatBigNumber("15000000000000000"),
        highestBidder: "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170",
        duration: "500", // auction finished
        startTime: "1676446773", // already started
        listingFeeRecipient: "0x0000000000000000000000000000000000000000",
        firstBidTime: "1676446830", // hit bid
        listingFeeBps: "0"
    }     

    // ZDK CONSTANTS

    const API_ENDPOINT = "https://api.zora.co/graphql";
            
    const zdk = new ZDK({
        endpoint: API_ENDPOINT,
        networks: [
        {
            chain: ZDKChain.Mainnet,
            network: ZDKNetwork.Ethereum,
        },
        ],
    })

    export function useAuction(contract: string, tokenId: string) {

        const { isConnected } = useAuth();

        // metadata state for zdk fetching
        const [metadata, setMetadata] = useState("")        

        const {data, isError, isLoading, isFetched, isSuccess, status} = useContractRead({
            address: mainnetZoraAddresses.ReserveAuctionListingEth,
            abi: auctionABI.abi,
            functionName: "auctionForNFT",
            args: [contract, tokenId],
            // cacheOnBlock: true,
            watch: true,
            catcheTime: 2_000,
            enabled: contract ? true : false
        })

        const cleanedAuctionData = data ? cleanIncomingAuctionData(data) : noLiveAuctionData
        /* for testing purposes: */
        // const cleanedAuctionData = auctionDoneNotSettled // noLiveAuctionData auctionExistsNotStartedData startedNoReservePriceYet gotFirstBidNotDone auctionDoneNotSettled
    
        // ZDK FLOW
        const args = {
            token: {
                address: contract,
                tokenId: tokenId
            },
            includeFullDetails: true // Optional, provides more data on the NFT such as all historical events
        }
        
        const tokenResponse = async (args: any) => {
            const zdkResponseTokens = await (await zdk.token(args)).token?.token
            setMetadata(zdkResponseTokens)
        }
        
        useEffect(() => {
            if (!!contract && !!tokenId) {
                tokenResponse(args)
            }},
            []
        )

    return {
        cleanedAuctionData,
        isError,
        isLoading,
        isFetched,
        isSuccess,
        status,
        metadata,
        isConnected
    }
}