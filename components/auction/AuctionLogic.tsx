import { AuctionLogicHeader } from 'components/elements/card/AuctionLogicHeader'
import { AuctionLogicFooter } from 'components/elements/card/AuctionLogicFooter'

export function AuctionLogic({auction, metadata, address, isConnected, zmmIsSuccess, zmmWaitLoading, zmmLoading, zmmWaitData, zmmData, zmmWrite}: any) {

    const currentUnixTime = Date.now() / 1000

    return (
        <div className="flex flex-row w-full justify-center">                    
            <div className="bg-[#F7F9F7] w-[320px] px-2 rounded-[8px] h-fit border-[1px] border-[#C9D2D2] drop-shadow-md flex flex-row flex-wrap">
                <AuctionLogicHeader 
                    time={currentUnixTime} 
                    auction={auction} 
                    metadata={metadata} 
                    address={address} 
                    isConnected={isConnected} 
                    zmmWaitData={zmmWaitData}
                    zmmLoading={zmmLoading}
                    zmmWaitLoading={zmmWaitLoading}
                    zmmIsSuccess={zmmIsSuccess}
                    zmmWrite={zmmWrite}
                    zmmData={zmmData}
                />
                <AuctionLogicFooter time={currentUnixTime} auction={auction} metadata={metadata} />
            </div>
        </div>        
    )
}