// @ts-nocheck
import { useAuction } from 'hooks/useAuction'
import {AuctionMedia} from "./AuctionMedia"
import {AuctionLogic} from "./AuctionLogic"

export function AuctionContainer({collectionAddress, tokenId}) {

    const { 
        cleanedAuctionData, 
        metadata, 
        isConnected 
    } = useAuction(collectionAddress, tokenId);

    return (
        <div className="flex flex-row  flex-wrap w-[90%] sm:w-[75%] justify-self-center items-start space-y-1">
            <AuctionMedia metadata={metadata} />        
            <AuctionLogic 
            auction={cleanedAuctionData} 
            metadata={metadata} 
            isConnected={isConnected} 
            />    
        </div>
    )
}