import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components";
import Image from 'next/image';

export function AuctionMedia({metadata}: any) {

    // const imageCID = metadata ? metadata.image.url.slice(7) : ""

    // const imageURL = metadata ? `https://ipfs.io/ipfs/${imageCID}` : ""

    const imageURL = "https://ipfs.io/ipfs/bafybeieqevmswsepaxqgmy4i7ho7yby4xanb3w4lrckjzb7j7yyolmtuxa"

    return (
        <div className="h-fit flex flex-row w-full justify-center">
            <div className="overflow-hidden relative rounded-[8px] w-[320px] h-[320px]">            
                <Image 
                    src={imageURL}
                    layout="fill"
                    objectFit='cover'
                />
            </div>
        </div>
    )
}