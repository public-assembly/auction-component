import Image from 'next/image';

export function AuctionMedia({metadata}: any) {

    const imageUrlCleaner = (input: string) => {
        if (input.substring(0, 6) == "ipfs://") {
            return `https://ipfs.io/ipfs/${input.slice(7)}`
        } else {
            return input
        }
    }
    const imageURL = metadata ? imageUrlCleaner(metadata.image.url) : ""

    return (
        <div className="h-fit flex flex-row w-full justify-center">
            <div className="flex flex-row justify-center items-center overflow-hidden relative rounded-[8px] bg-white drop-shadow-sm w-[320px] h-[320px]">            
            <>
            {!metadata ? (
                <div></div>
            ) : (
                <a href={`https://opensea.io/assets/ethereum/${metadata?.collectionAddress}/${metadata?.tokenId}`}>                
                    <Image 
                        src={imageURL}
                        layout="fill"
                        objectFit='contain'
                    />
                </a>
            )}
            </>
            </div>
        </div>
    )
}