// @ts-nocheck
import { shortenAddress } from '../../../utils'
import {useState} from "react"
import {usePrepareContractWrite, useContractWrite, useProvider} from 'wagmi'
import goerliZoraAddresses from "@zoralabs/v3/dist/addresses/5.json";
import auctionABI from "@zoralabs/v3/dist/artifacts/ReserveAuctionListingEth.sol/ReserveAuctionListingEth.json"
import {BigNumber, utils, Contract} from "ethers"
import { BasementProvider } from '@basementdev/ethers-provider';


export function AuctionLogicHeader({time, auction, metadata}: any) {

    const [bidValue, setBidValue] = useState<number>('');

    const bidInputPlain: string = bidValue ? utils.parseEther(bidValue.toString()) : ""
    const bidInputConverted: string = bidInputPlain != "" ? BigNumber.from(bidInputPlain).toString() : ""

    const validBidCheck = () => {
        if (!!auction && Number(auction.highestBid) < Number(auction.reservePrice)) {
            return bidValue >= Number(auction.reservePrice) ? true : false
        } else if (!!auction && Number(auction.highestBid) >= Number(auction.reservePrice)) {
            return bidValue >= Number(auction.highestBid) * 1.1 ? true : false
        } else {
            return false
        }
    }

    const validBid: bool = validBidCheck()    

    console.log("reserve price converted: ", (Number(auction.reservePrice) * 10e18).toString())
    console.log("bidInputConverted: ", bidInputConverted)
    console.log("bid value eth", bidValue)
    console.log("rserve price eth", (Number(auction.reservePrice)))
    console.log("validBid: ", validBid)

    // if highest bid isnt greater or equal to reserve price
        // then bed must be equal to at least reserve price
    // if highest bid is higher than reserve price
        // then bid must be at least 1.10x current highest bid

        // PLACE BID FLOW
        const { config: bidConfig } = usePrepareContractWrite({
            address: goerliZoraAddresses.ReserveAuctionListingEth,
            abi: auctionABI.abi,
            functionName: "createBid",
            args: [
                metadata.collectionAddress, // collection address
                metadata.tokenId,  // tokenid

            ],
            enabled: validBid ? true : false,
            overrides: {
                value: bidInputConverted,
            }
        })

        const { 
            write: bidWrite, 
            isError: bidIsError, 
            isLoading: bidIsLoading, 
            isSuccess: bidIsSuccess, 
            status: bidSucess 
        } = useContractWrite(bidConfig)   

        // PLACE BID FLOW
        const validSettleCheck = () => {
            if (!!auction && ((Number(auction.firstBidTime) + Number(auction.duration)) < time)) {
                return true
            } else {
                return false
            }
        }

        const validSettle: bool = validBidCheck()

        const { config: settleConfig } = usePrepareContractWrite({
            address: goerliZoraAddresses.ReserveAuctionListingEth,
            abi: auctionABI.abi,
            functionName: "settleAuction",
            args: [
                metadata.collectionAddress, // collection address
                metadata.tokenId,  // tokenid

            ],
            enabled: validSettle ? true : false,
            overrides: {
                value: bidInputConverted,
            }
        })
        
        const { 
            write: settleWrite, 
            isError: settleIsError, 
            isLoading: settleIsLoading, 
            isSuccess: settleIsSuccess, 
            status: settleStatus  
        } = useContractWrite(settleConfig)         

        const calculateBidFloor = () => {
            return !!auction ? (Number(auction.reservePrice) * 1.1).toFixed(2).toString() : "0"
        }

        const bidFloorCheck = () => {
            if (!!auction && Number(auction.highestBid) < Number(auction.reservePrice)) {
                return auction.reservePrice
            } else if (!!auction && Number(auction.highestBid) >= Number(auction.reservePrice)) {
                // let intermediary = BigNumber.from((Number(auction.highestBid) * 1.1).toString()).toString()
                let intermediary = ((Number(auction.highestBid) * 1.1).toString())
                // return utils.formatEther(intermediary)             
                return intermediary
            } else {
                return "0"
            }
        }        

        const bidFloor: string = bidFloorCheck()

        console.log("bid floor should be ", bidFloor)


        // tim echecke
        console.log("auction.firstbidtime", auction.firstBidTime)
        console.log("auction.duration", auction.duration)
        console.log("duration + first bid", Number(auction.firstBidTime) + Number(auction.duration))
        console.log("time", time)
        console.log("shold acution still be running?", (Number(auction.firstBidTime) + Number(auction.duration)) > time ? true : false)


        // state for loading txns
        const svgLoader = () => {
            return (
                <div className="flex flex-row justify-center w-full h-full">
                    <img
                    className="text-black rounded-full" 
                    width="26px"
                    src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                    />
                </div>
            )
        }

        const bidCTA = bidIsLoading
            ? svgLoader()
            : bidIsSuccess
            ? "Bid"
            : "Bid"        

        const settleCTA = settleIsLoading
            ? svgLoader()
            : settleIsSuccess
            ? "Settled"
            : "Settle auction"

    // const translateENS = (inputAddress: `0x${string}` | undefined) => {

    //     const { data } = useEnsName({
    //         address: inputAddress
    //     })
    //     return !!data ? data : shortenAddress(inputAddress)
    // }    

    if (!time || !auction || !metadata) {
        return (
            <div className="flex flex-row flex-wrap w-full">
                <div className="flex flex-row w-full text-[18px]">
                    collection:
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by: 
                </div>                    
            </div>            
        )
    } else if (auction.seller == "0x0000000000000000000000000000000000000000") {
        return (
            <div className="flex flex-row flex-wrap w-full">
                <div className="flex flex-row w-full text-[18px]">
                    {metadata.metadata.name}
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(metadata.mintInfo.originatorAddress)}
                    </div>
                </div>                    
            </div>
        )
    } else if (Number(auction.startTime) > time) {
        return (
            <div className="flex flex-row flex-wrap w-full pb-[16px] ">
                <div className="flex flex-row w-full text-[18px]">
                    {metadata.metadata.name}
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(metadata.mintInfo.originatorAddress)}
                    </div>
                </div>                        
                <div className="flex flex-row w-full text-[16px] pt-[8px]font-mono ">
                    Ξ&nbsp;{auction.reservePrice}
                </div>                                           
            </div>
        )
    } else if (auction.firstBidTime == "0") {
        return (
            <div className="flex flex-row flex-wrap w-full pb-[16px]">
                <div className="flex flex-row w-full text-[18px]">
                    {metadata.metadata.name}
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(metadata.mintInfo.originatorAddress)}
                    </div>
                </div>                        
                <div className="mt-[12px] grid-rows-1 grid-cols-[2fr_1fr] space-x-3 h-[40px] w-full text-[16px] ">
                    <input 
                        type="number"
                        placeholder={`Ξ ${bidFloor} OR MORE`}
                        className="px-2 h-full cols-start-0 cols-end-1 row-start-0 row-end-1 text-[14px] font-mono bg-[#EAECEB] rounded-[4px]"
                        value={bidValue}
                        onChange={(e) => {
                            e.preventDefault();
                            // setBidValue(e.target.value)      
                            setBidValue((current: number) => {
                                return e.target.value
                            })
                        }}
                    >
                    </input>
                    <button 
                        className="px-2 h-full rounded-[4px] cols-start-1 cols-end-2 row-start-0 row-end-1 w-[88px]  bg-[#1E1F22] text-white"
                        disabled={!validBid}
                        onClick={()=>write()}
                    >
                        Bid
                    </button>
                </div>                                                      
            </div>            
        )
    } else if ((Number(auction.firstBidTime) + Number(auction.duration)) > time) {
        return (
            <div className="flex flex-row flex-wrap w-full pb-[16px]">
                <div className="flex flex-row w-full text-[18px]">
                    {metadata.metadata.name}
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(metadata.mintInfo.originatorAddress)}
                    </div>
                </div>                        
                <div className="mt-[12px] grid-rows-1 grid-cols-[2fr_1fr] space-x-3 h-[40px] w-full text-[16px] ">
                    <input 
                        type="number"
                        placeholder={`Ξ ${bidFloor} OR MORE`}
                        className="border-none px-2 h-full cols-start-0 cols-end-1 row-start-0 row-end-1 text-[14px] font-mono bg-[#EAECEB] rounded-[4px]"
                        value={bidValue}
                        onChange={(e) => {
                            e.preventDefault();
                            // setBidValue(e.target.value)      
                            setBidValue((current: number) => {
                                return e.target.value
                            })
                        }}
                    >
                    </input>
                    <button 
                        className="disabled:bg-[#C9D2D2] disabled:bg-opacity-[40%] disabled:border-none disabled:text-[#C9D2D2] focus:bg-[#EAECEB] focus:border-[1px] focus:border-[#1E1F22] hover:border-[1px] hover:border-[#1E1F22] focus:text-[#1E1F22] hover:bg-[#889292] border-[1px] border-[#1E1F22] px-2 h-full rounded-[4px] cols-start-1 cols-end-2 row-start-0 row-end-1 w-[88px]  bg-[#1E1F22] text-white"
                        disabled={!validBid}
                        onClick={()=>write()}
                    >
                        Bid
                    </button>
                </div>   
                <div className="flex flex-row w-full pt-[16px] text-[16px]">
                    Current Bid&nbsp;&nbsp;<div className="text-[#889292]">Ξ&nbsp;{auction.highestBid}</div>
                </div>     
                {/* <div className="flex flex-row items-center text-[#889292] w-6/12 pt-[16px] text-[16px]">
                    View bid history&nbsp;
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2356 7.67353C13.3658 7.8037 13.3658 8.01476 13.2356 8.14493L12.7642 8.61633L8.99298 12.3876C8.8628 12.5177 8.65175 12.5177 8.52157 12.3876L8.05017 11.9162C7.91999 11.786 7.91999 11.5749 8.05017 11.4448L10.8717 8.62327L2.99992 8.62327C2.81582 8.62327 2.66658 8.47403 2.66658 8.28994L2.66658 7.62327C2.66658 7.43918 2.81582 7.28994 2.99992 7.28994L10.9664 7.28994L8.05017 4.37369C7.92 4.24352 7.92 4.03246 8.05017 3.90229L8.52158 3.43088C8.65175 3.30071 8.86281 3.30071 8.99298 3.43088L12.7638 7.20167L13.2356 7.67353Z" fill="#889292"/>
                    </svg>
                </div>      */}
                <div className="flex flex-row pt-[4px] w-full text-[16px]">
                    Bidder&nbsp;<div className="text-[#889292]">{shortenAddress(auction.highestBidder)}</div>
                </div>                                                                       
            </div>        
        )   
    } else if ((Number(auction.firstBidTime) + Number(auction.duration)) < time) {
        return (
            <div className="flex flex-row flex-wrap w-full pt-[12px] pb-[16px] ">
                <div className="flex flex-row w-full text-[18px]">
                    {metadata.metadata.name}
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(metadata.mintInfo.originatorAddress)}
                    </div>
                </div>                        
                <div className="flex flex-row w-full text-[16px] pt-[16px] font-mono ">
                    Ξ&nbsp;{auction.highestBid}
                </div>              
                <div className="flex flex-row w-full text-[16px] pt-[4px] pb-[16px]">
                    Auction won by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(auction.highestBidder)}
                    </div>
                </div>      
                <button 
                        className=" focus:bg-[#EAECEB] focus:border-[1px] focus:border-[#1E1F22] hover:border-[1px] hover:border-[#1E1F22] focus:text-[#1E1F22] hover:bg-[#889292] border-[1px] border-[#1E1F22] px-2 h-fit rounded-[4px] w-full py-2 text-[16px] bg-[#1E1F22] text-white"
                        disabled={!validSettle}
                        onClick={()=>settleWrite()}
                    >
                        {settleCTA}
                    </button>                                          
            </div>
        )
    } else {
        return (
            <div className="flex flex-row flex-wrap w-full">
                <div className="flex flex-row w-full text-[18px]">
                    collection:
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by: 
                </div>                    
            </div>  
        )
    }
}