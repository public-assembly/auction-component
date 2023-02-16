import { useAuction } from 'hooks/useAuction'
import {BigNumber, utils} from "ethers"
import {
    useAccount,
    useEnsName
} from 'wagmi'

import { AuctionLogicHeader } from 'components/elements/card/AuctionLogicHeader'
import { AuctionLogicFooter } from 'components/elements/card/AuctionLogicFooter'

export function AuctionLogic({auction, metadata}: any) {

    const currentUnixTime = Date.now() / 1000

    return (
        <div className="flex flex-row w-full justify-center">                    
            <div className="bg-[#F7F9F7] w-[320px] px-2 rounded-[8px] h-fit border-[1px] border-[#C9D2D2] drop-shadow-md flex flex-row flex-wrap">
                <AuctionLogicHeader time={currentUnixTime} auction={auction} metadata={metadata} />
                <AuctionLogicFooter time={currentUnixTime} auction={auction} metadata={metadata} />
            </div>
        </div>        
    )

    // if (auction.seller == "0x0000000000000000000000000000000000000000") {
    //     // auction doesnt exist
    //     return (
    //         <div className="flex flex-row w-full justify-center">                    
    //             <div className="bg-[#F7F9F7] w-[320px] p-2 rounded-[8px] h-fit border-[1px] border-[#C9D2D2] drop-shadow-md flex flex-row flex-wrap">
    //                 <AuctionLogicHeader time={currentUnixTime} auction={auction} metadata={metadata} />
    //                 <AuctionLogicFooter time={currentUnixTime} auction={auction} metadata={metadata} />
    //             </div>
    //         </div>
    //     )
    // } else if (Number(auction.startTime) < currentUnixTime) {
    //     // auction exists but hasnt started yet
    //     return (
    //         <div className="flex flex-row w-full justify-center">
    //             <div className="bg-[#F7F9F7] w-[320px] p-2 rounded-[8px] h-fit border-[1px] border-[#C9D2D2] drop-shadow-md flex flex-row flex-wrap">                                        
    //                 {/* <div className="flex flex-row flex-wrap w-full"> */}
    //                     <AuctionLogicHeader time={currentUnixTime} auction={auction} metadata={metadata} />  
    //                     <AuctionLogicFooter time={currentUnixTime} auction={auction} metadata={metadata} />                       
    //                     {/* <div className="flex flex-row w-full text-[16px] pt-[8px] pb-[16px] font-mono ">
    //                         Ξ&nbsp;{auction.reservePrice}
    //                     </div>                                            */}
    //                 {/* </div> */}
    //                 {/* <div className="flex flex-row flex-wrap w-full pt-[16px] border-t-[1px] border-[#C9D2D2]">
    //                     <div className="flex flex-row w-full text-[18px] pb-[8px]">
    //                         Starts in&nbsp;
    //                         <Countdown date={startTimeConverter(auction.startTime)} 
    //                             intervalDelay={1000}
    //                             precision={0}
    //                             renderer={countdownRenderer}
    //                         />                              
    //                     </div>   
    //                     <div className="flex flex-row w-full text-[16px] pb-[4px]">
    //                         Listed by&nbsp;
    //                         <div className="text-[#889292]">
    //                         {auction ? shortenAddress(auction.seller) : ""}
    //                         </div>
    //                     </div>                                                                
    //                 </div>                     */}
    //             </div>
    //         </div>
    //     )
    // } else if (auction.firstBidTime == 0) {
    //     return (
    //         <div>
    //             au
    //             ction started but reserve price not met
    //         </div>
    //     )        
    // } else if ((auction.firstBidTime + auction.duration) < currentUnixTime) {
    //     return (
    //         <div>
    //             auction has received at least one bid
    //         </div>
    //     )
    // } else {
    //     return (
    //         <div>
    //             auction has ended and someone won -- but not settled yet
    //         </div>
    //     )
    // }
}