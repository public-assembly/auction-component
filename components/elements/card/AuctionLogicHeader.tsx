// @ts-nocheck
import { shortenAddress } from '../../../utils'
import {useState} from "react"
import {usePrepareContractWrite, useContractWrite, useWaitForTransaction, useProvider} from 'wagmi'
import goerliZoraAddresses from "@zoralabs/v3/dist/addresses/5.json";
import auctionABI from "@zoralabs/v3/dist/artifacts/ReserveAuctionListingEth.sol/ReserveAuctionListingEth.json"
import {BigNumber, utils, Contract} from "ethers"
import { BasementProvider } from '@basementdev/ethers-provider';


export function AuctionLogicHeader({time, auction, metadata}: any) {

    console.log("auction coming in :", auction)

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
        const { config: bidConfig, error: bidError } = usePrepareContractWrite({
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
            data: bidData,
            isError: bidIsError, 
            isLoading: bidIsLoading, 
            isSuccess: bidIsSuccess, 
            status: bidSucess 
        } = useContractWrite(bidConfig)   

        // Wait for data from bid call
        const { data: bidWaitData, isLoading: bidWaitLoading } = useWaitForTransaction({
            hash:  bidData?.hash,
            onSuccess(bidWaitData) {
                console.log("txn complete: ", bidWaitData)
                console.log("txn hash: ", bidWaitData.transactionHash)
            }
        })              

        //  SETTLE AUCTINO FLOW
        const validSettleCheck = () => {
            if (!!auction && ((Number(auction.firstBidTime) + Number(auction.duration)) < time)) {
                return true
            } else {
                return false
            }
        }

        const validSettle: bool = validSettleCheck()

        const { config: settleConfig, error: settleError } = usePrepareContractWrite({
            address: goerliZoraAddresses.ReserveAuctionListingEth,
            abi: auctionABI.abi,
            functionName: "settleAuction",
            args: [
                metadata.collectionAddress, // collection address
                metadata.tokenId,  // tokenid

            ],
            enabled: validSettle ? true : false
        })
        
        const { 
            write: settleWrite, 
            data: settleData,
            isError: settleIsError, 
            isLoading: settleIsLoading, 
            isSuccess: settleIsSuccess, 
            status: settleStatus  
        } = useContractWrite(settleConfig)        
        
        // Wait for data from settle call
        const { data: settleWaitData, isLoading: settleWaitLoading } = useWaitForTransaction({
            hash:  settleData?.hash,
            onSuccess(settleWaitData) {
                console.log("txn complete: ", settleWaitData)
                console.log("txn hash: ", settleWaitData.transactionHash)
            }
        })                  

        const calculateBidFloor = () => {
            return !!auction ? (Number(auction.reservePrice) * 1.1).toFixed(2).toString() : "0"
        }

        const bidFloorCheck = () => {
            if (!!auction && Number(auction.highestBid) < Number(auction.reservePrice)) {
                return auction.reservePrice
            } else if (!!auction && Number(auction.highestBid) >= Number(auction.reservePrice)) {
                // let intermediary = BigNumber.from((Number(auction.highestBid) * 1.1).toString()).toString()
                let intermediary = ((Number(auction.highestBid) * 1.1).toFixed(5).toString())
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
                <div className="flex flex-row justify-center items-center w-full h-[30px]">
                    <img
                    className="text-black rounded-full" 
                    width="26px"
                    src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                    />
                </div>
            )
        }

        const bidCTA = bidIsLoading || bidWaitLoading
            ? svgLoader()
            : bidIsSuccess
            ? "Bid"
            : "Bid"        

        const settleCTA = settleIsLoading || settleWaitLoading
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
                <div className="flex flex-row w-full text-[18px] pb-[2px]">
                    collection:
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by: 
                </div>                    
            </div>            
        )
    } else if (auction.seller == "0x0000000000000000000000000000000000000000") {
        return (
            <div className="flex flex-row flex-wrap w-full py-[12px]">
                <div className="flex flex-row w-full text-[18px] pb-[2px]">
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
            <div className="flex flex-row flex-wrap w-full pb-[16px] pt-[12px]">
                <div className="flex flex-row w-full text-[18px] pb-[2px]">
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
            <div className="flex flex-row flex-wrap w-full pb-[16px] pt-[12px]">
                <div className="flex flex-row w-full text-[18px] pb-[2px]">
                    {metadata.metadata.name}
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(metadata.mintInfo.originatorAddress)}
                    </div>
                </div>                        
                <div className="mt-[12px] grid-rows-1 grid-cols-[2fr_1fr] flex flex-row items-center h-fit space-x-3 w-full text-[16px] ">
                    <input 
                        type="number"
                        placeholder={`Ξ ${bidFloor} OR MORE`}
                        className="border-none px-2 h-[40px] h-min-[40px] cols-start-0 cols-end-1 row-start-0 row-end-1 text-[14px] font-mono bg-[#EAECEB] rounded-[4px]"
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
                        className="disabled:bg-[#C9D2D2] disabled:bg-opacity-[40%] disabled:border-none disabled:text-[#C9D2D2] focus:bg-[#EAECEB] focus:border-[1px] focus:border-[#1E1F22] hover:cursor-pointer hover:border-[1px] hover:border-[#1E1F22] focus:text-[#1E1F22] hover:bg-[#889292] border-[1px] border-[#1E1F22] px-2 h-[40px] min-h-[40px] rounded-[4px] cols-start-1 cols-end-2 row-start-0 row-end-1 w-[88px]  bg-[#1E1F22] text-white"
                        disabled={!validBid || !!bidError ? true : false}
                        onClick={()=>bidWrite()}
                    >
                        {bidCTA}
                    </button>
                </div>                                                       
            </div>            
        )
    } else if ((Number(auction.firstBidTime) + Number(auction.duration)) > time) {
        return (
            <div className="flex flex-row flex-wrap w-full pb-[16px] pt-[12px]">
                <div className="flex flex-row w-full text-[18px] pb-[2px]">
                    {metadata.metadata.name}
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(metadata.mintInfo.originatorAddress)}
                    </div>
                </div>                        
                <div className="mt-[12px] grid-rows-1 grid-cols-[2fr_1fr] flex flex-row items-center h-fit space-x-3 w-full text-[16px] ">
                    <input 
                        type="number"
                        placeholder={`Ξ ${bidFloor} OR MORE`}
                        className="border-none px-2 h-[40px] h-min-[40px] cols-start-0 cols-end-1 row-start-0 row-end-1 text-[14px] font-mono bg-[#EAECEB] rounded-[4px]"
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
                        className="disabled:bg-[#C9D2D2] disabled:bg-opacity-[40%] disabled:border-none disabled:text-[#C9D2D2] focus:bg-[#EAECEB] focus:border-[1px] focus:border-[#1E1F22] hover:cursor-pointer hover:border-[1px] hover:border-[#1E1F22] focus:text-[#1E1F22] hover:bg-[#889292] border-[1px] border-[#1E1F22] px-2 h-[40px] min-h-[40px] rounded-[4px] cols-start-1 cols-end-2 row-start-0 row-end-1 w-[88px]  bg-[#1E1F22] text-white"
                        disabled={!validBid || !!bidError ? true : false}
                        onClick={()=>bidWrite()}
                    >
                        {bidCTA}
                    </button>
                </div>   
                <div className="flex flex-row w-full pt-[16px] text-[16px]">
                    Current Bid&nbsp;<div className="text-[#889292]">Ξ&nbsp;{auction.highestBid}</div>
                </div>     
                <div className="flex flex-row pt-[4px] w-full text-[16px]">
                    Bidder&nbsp;<div className="text-[#889292]">{shortenAddress(auction.highestBidder)}</div>
                </div>                                                                       
            </div>        
        )   
    } else if ((Number(auction.firstBidTime) + Number(auction.duration)) < time) {
        return (
            <div className="flex flex-row flex-wrap h-fit w-full pt-[12px] pb-[16px] ">
                <div className="flex flex-row w-full text-[18px] pb-[2px]">
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
                        className=" focus:bg-[#EAECEB] focus:border-[1px] focus:border-[#1E1F22] hover:cursor-pointer hover:border-[1px] hover:border-[#1E1F22] focus:text-[#1E1F22] hover:bg-[#889292] border-[1px] border-[#1E1F22] px-2 h-[40px] h-min-[40px] rounded-[4px] w-full py-2 text-[16px] bg-[#1E1F22] text-white"
                        disabled={!validSettle || !!settleError ? true : false}
                        onClick={()=>settleWrite()}
                    >
                        {settleCTA}
                    </button>                                          
            </div>
        )
    } else {
        return (
            <div className="flex flex-row flex-wrap w-full">
                <div className="flex flex-row w-full text-[18px] pb-[2px]">
                    collection:
                </div>
                <div className="flex flex-row w-full text-[16px]">
                    by: 
                </div>                    
            </div>  
        )
    }
}