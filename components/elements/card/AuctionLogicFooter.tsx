// @ts-nocheck

import { shortenAddress } from '../../../utils'
import Countdown from "react-countdown"
import {useState} from "react"
import {usePrepareContractWrite, useContractWrite} from 'wagmi'
import goerliZoraAddresses from "@zoralabs/v3/dist/addresses/5.json";
import auctionABI from "@zoralabs/v3/dist/artifacts/ReserveAuctionListingEth.sol/ReserveAuctionListingEth.json"

const countdownRenderer = ({ days, hours, minutes, seconds }: any) => {
    return (
        <div>
            {`${days}d ` + `${hours}h ` + `${minutes}m ` + `${seconds}s`}
        </div>
    )
}

const startTimeConverter = (startTimeUnixSeconds: any) => {
    const startTimeConverted: any = new Date(startTimeUnixSeconds * 1000).toISOString();
    return startTimeConverted
}

export function AuctionLogicFooter({time, auction, metadata}: any) {

    // const bidHandler = () => {

    // }

    // const translateENS = (inputAddress: `0x${string}` | undefined) => {

    //     const { data } = useEnsName({
    //         address: inputAddress
    //     })
    //     return !!data ? data : shortenAddress(inputAddress)
    // }    

    // console.log('whats up with auction', auction)
    // console.log("whats now?", time)
    // console.log("whats starttime?", Number(auction.startTime))

    // console.log(Number(auction.startTime) < time ? true : false)

    if (!time || !auction || !metadata) {
        return <div></div>
    } else if (auction.seller == "0x0000000000000000000000000000000000000000") {
        return <div></div>
    } else if (Number(auction.startTime) > time) {
        return (
            <div className="flex flex-row flex-wrap w-full pt-[16px] border-t-[1px] border-[#C9D2D2]">
                <div className="flex flex-row w-full text-[18px] pb-[8px]">
                    Starts in&nbsp;
                    <Countdown date={startTimeConverter(auction.startTime)} 
                        intervalDelay={1000}
                        precision={0}
                        renderer={countdownRenderer}
                    />                              
                </div>   
                <div className="flex flex-row w-full text-[16px] pb-[4px]">
                    Listed by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(auction.seller)}
                    </div>
                </div>                                                                
            </div> 
        )
    } else if (auction.firstBidTime == "0") {
        return (
            <div className="flex flex-row flex-wrap w-full pt-[16px] border-t-[1px] border-[#C9D2D2]">
                <div className="flex flex-row w-full text-[18px] pb-[8px]">
                    Auction is live                                               
                </div>   
                <div className="flex flex-row w-full text-[16px] pb-[4px]">
                    Listed by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(auction.seller)}
                    </div>
                </div>                                                                
            </div>             
        )
    } else if ((Number(auction.firstBidTime) + Number(auction.duration)) > time) {
        return (
            <div className="flex flex-row flex-wrap w-full pt-[16px] border-t-[1px] border-[#C9D2D2]">
                <div className="flex flex-row w-full text-[18px] pb-[8px]">                    
                    <Countdown date={startTimeConverter(Number(auction.firstBidTime) + Number(auction.duration))} 
                        intervalDelay={1000}
                        precision={0}
                        renderer={countdownRenderer}
                    />                              
                    &nbsp;remaining
                </div>   
                <div className="flex flex-row w-full text-[16px] pb-[4px]">
                    Listed by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(auction.seller)}
                    </div>
                </div>                                                                
            </div>               
        )
    } else if ((Number(auction.firstBidTime) + Number(auction.duration)) < time) {        
        return (
            <div className="flex flex-row flex-wrap w-full pt-[16px] pb-[12px] border-t-[1px] border-[#C9D2D2]">
                <div className="flex flex-row w-full text-[16px]">
                    Listed by&nbsp;
                    <div className="text-[#889292]">
                    {shortenAddress(auction.seller)}
                    </div>
                </div>                  
            </div>                            
        )
    } else {
        return <div></div>
    }
}