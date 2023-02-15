import { useAuction } from 'hooks/useAuction'
import {BigNumber, utils} from "ethers"
import {
    useAccount,
    useEnsName
} from 'wagmi'

import { shortenAddress } from '../../utils'
import {useState, useEffect} from "react"
import Countdown from "react-countdown"

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

export function AuctionLogic({auction, metadata}: any) {

    // const translateENS = (inputAddress: `0x${string}` | undefined) => {

    //     const { data } = useEnsName({
    //         address: inputAddress
    //     })
    //     return !!data ? data : shortenAddress(inputAddress)
    // }    

    console.log("what auction getting imported", auction)

    const currentUnixTime = Date.now() * 1000

    if (auction.seller == "0x0000000000000000000000000000000000000000") {
        // auction doesnt exist
        return (
            <div className="flex flex-row w-full justify-center">
                <div className="bg-[#F7F9F7] w-[320px] p-2 rounded-[8px] h-fit border-[1px] border-[#C9D2D2] drop-shadow-md flex flex-row flex-wrap">
                    <div className="flex flex-row flex-wrap w-full">
                        <div className="flex flex-row w-full text-[18px]">
                            {metadata ? metadata.metadata.name : "Collection: "}
                        </div>
                        <div className="flex flex-row w-full text-[16px]">
                            by&nbsp;
                            <div className="text-[#889292]">
                            {metadata ? shortenAddress(metadata.owner) : ""}
                            </div>
                        </div>                    
                    </div>
                </div>
            </div>
        )
    } else if (Number(auction.startTime) < currentUnixTime) {
        // auction exists but hasnt started yet
        return (
            <div className="flex flex-row w-full justify-center">
                <div className="bg-[#F7F9F7] w-[320px] p-2 rounded-[8px] h-fit border-[1px] border-[#C9D2D2] drop-shadow-md flex flex-row flex-wrap">
                    <div className="flex flex-row flex-wrap w-full border-b-[1px] border-[#C9D2D2]">
                        <div className="flex flex-row w-full text-[18px] pb-[4px]">
                            {metadata ? metadata.metadata.name : "Collection: "}
                        </div>
                        <div className="flex flex-row w-full text-[16px] pb-[8px]">
                            by&nbsp;
                            <div className="text-[#889292]">
                            {metadata ? shortenAddress(metadata.owner) : ""}
                            </div>
                        </div> 
                        <div className="flex flex-row w-full text-[16px] pb-[16px] font-mono ">
                            Ξ&nbsp;{auction.reservePrice}
                        </div>                                           
                    </div>
                    <div className="flex flex-row flex-wrap w-full pt-[16px]">
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
                            {auction ? shortenAddress(auction.seller) : ""}
                            </div>
                        </div>                                                                
                    </div>                    
                </div>
            </div>
        )
    } else if (auction.firstBidTime == 0) {
        return (
            <div>
                au
                ction started but reserve price not met
            </div>
        )        
    } else if ((auction.firstBidTime + auction.duration) < currentUnixTime) {
        return (
            <div>
                auction has received at least one bid
            </div>
        )
    } else {
        return (
            <div>
                auction has ended and someone won -- but not settled yet
            </div>
        )
    }
}