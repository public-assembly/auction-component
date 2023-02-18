// @ts-nocheck
import { useAuction } from 'hooks/useAuction'
import {AuctionMedia} from "./AuctionMedia"
import {AuctionLogic} from "./AuctionLogic"

export function AuctionContainer({collectionAddress, tokenId}) {


    const { 
        cleanedAuctionData, 
        metadata, 
        address, 
        isConnected, 
        zmmData, 
        zmmWaitData,
        zmmLoading,
        zmmWaitLoading,
        zmmIsSuccess,    
        zmmWrite
    } = useAuction(collectionAddress, tokenId);
    
    console.log("token Id + auction data", tokenId, cleanedAuctionData)


    return (
        <div className="flex flex-row  flex-wrap w-[90%] sm:w-[75%] justify-self-center items-start space-y-1">
            <AuctionMedia metadata={metadata} address={address} />        
            <AuctionLogic 
            auction={cleanedAuctionData} 
            metadata={metadata} 
            isConnected={isConnected} 
            zmmData={zmmData} 
            zmmWrite={zmmWrite} 
            zmmWaitData={zmmWaitData}
            zmmLoading={zmmLoading}
            zmmWaitLoading={zmmWaitLoading}
            zmmIsSuccess={zmmIsSuccess}
            />    
        </div>
    )
}