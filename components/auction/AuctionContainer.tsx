// @ts-nocheck
import { useAuction } from 'hooks/useAuction'
import {AuctionMedia} from "./AuctionMedia"
import {AuctionLogic} from "./AuctionLogic"

export function AuctionContainer({collectionAddress, tokenId}) {

    const { cleanedAuctionData, metadata} = useAuction(collectionAddress, tokenId);

    return (
        <div className="flex flex-row  flex-wrap w-[90%] sm:w-[75%] justify-self-center items-start space-y-1">
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