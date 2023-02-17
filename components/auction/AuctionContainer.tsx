import { useAuction } from 'hooks/useAuction'
import {BigNumber, utils} from "ethers"
import {
    useAccount,
    useEnsName
} from 'wagmi'

import {AuctionMedia} from "./AuctionMedia"
import {AuctionLogic} from "./AuctionLogic"
import { useNFT, Strategies, Networks } from "@zoralabs/nft-hooks";
import { ZDK, ZDKChain, ZDKNetwork } from '@zoralabs/zdk';

// @ts-ignore

export function AuctionContainer({collectionAddress, tokenId}) {

    const { cleanedAuctionData, metadata, createAuctionData, createAuctionWrite  } = useAuction(collectionAddress, tokenId);

    console.log("what is metadata: ", metadata)
    console.log("what is cleanedAuctionData: ", cleanedAuctionData)

    return (
        <div className="flex flex-row flex-wrap w-[90%] sm:w-[75%] justify-center items-start space-y-1">
            {/* <button className="border-[1px] border-black p-4" onClick={()=>!!createAuctionWrite ? createAuctionWrite(): null}>
                Create Auction
            </button> */}
            <AuctionMedia metadata={metadata} />        
            <AuctionLogic auction={cleanedAuctionData} metadata={metadata} />    
            <div className="flex flex-row flex-wrap w-[90%] sm:w-[75%] justify-center items-start space-y-1">
            {/* <button className="border-[1px] border-black p-4" onClick={()=>!!createAuctionWrite ? createAuctionWrite(): null}>
                Create Auction
            </button> */}
            <AuctionMedia metadata={metadata} />        
            <AuctionLogic auction={cleanedAuctionData} metadata={metadata} />    
        </div>,
        <div className="flex flex-row flex-wrap w-[90%] sm:w-[75%] justify-center items-start space-y-1">
            {/* <button className="border-[1px] border-black p-4" onClick={()=>!!createAuctionWrite ? createAuctionWrite(): null}>
                Create Auction
            </button> */}
            <AuctionMedia metadata={metadata} />        
            <AuctionLogic auction={cleanedAuctionData} metadata={metadata} />    
        </div>,
        <div className="flex flex-row flex-wrap w-[90%] sm:w-[75%] justify-center items-start space-y-1">
            {/* <button className="border-[1px] border-black p-4" onClick={()=>!!createAuctionWrite ? createAuctionWrite(): null}>
                Create Auction
            </button> */}
            <AuctionMedia metadata={metadata} />        
            <AuctionLogic auction={cleanedAuctionData} metadata={metadata} />    
        </div>,
        <div className="flex flex-row flex-wrap w-[90%] sm:w-[75%] justify-center items-start space-y-1">
            {/* <button className="border-[1px] border-black p-4" onClick={()=>!!createAuctionWrite ? createAuctionWrite(): null}>
                Create Auction
            </button> */}
            <AuctionMedia metadata={metadata} />        
            <AuctionLogic auction={cleanedAuctionData} metadata={metadata} />    
        </div>
        </div>
        
        
    )
}