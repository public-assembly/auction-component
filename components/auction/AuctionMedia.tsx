import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components";
import { NFTObject, Networks, Strategies } from '@zoralabs/nft-hooks'
import Image from 'next/image';

export function AuctionMedia({metadata}: any) {

    const imageCID = metadata ? metadata.image.url.slice(7) : ""

    // Arweave strategy
    const imageURL = metadata ? `https:/${imageCID}` : ""

    // IPFS strategy
    // const imageURL = metadata ? `https://ipfs.io/ipfs/${imageCID}` : ""

    // NFT Preview strategy
    const zdkStrategyMainnet = new Strategies.ZDKFetchStrategy(
        Networks.MAINNET
    )

    const STYLE_OVERRIDE = {
        theme: {
            bodyFont: `font-family: courier, "Courier New", andale mono, monaco, monospace, sans serif;`,
            titleFont: `font-family: courier, "Courier New", andale mono, monaco, monospace, sans serif;`,
            linkColor: 'black',
            borderStyle: "none",
            defaultBorderRadius: 10,
            showOwner: false,
            showCreator: false,
            previewCard: {
                background: 'none'
            },
            padding: '3px',
            showTxnLinks: true,
            useEnsResolution: true,
            useCollectionTag: true,
        },
    };

    return (
        <div className="h-fit flex flex-row w-full justify-center">
            <div className="flex flex-row justify-center overflow-hidden relative rounded-[8px] w-[320px] h-[320px]">            
                <a href={`https://opensea.io/assets/ethereum/${metadata?.collectionAddress}/${metadata?.tokenId}`}>                
                    <Image 
                        src={imageURL}
                        layout="fill"
                        objectFit='cover'
                    />
                </a>
                    {/* <MediaConfiguration
                    key={`${metadata?.collectionAddress}-${metadata?.tokenId}`} 
                    style={STYLE_OVERRIDE}
                    networkId="1"
                    strategy={zdkStrategyMainnet}
                    strings={{
                    CARD_OWNED_BY: "↳",
                    CARD_CREATED_BY: "↳",              
                    }}
                >
                    <NFTPreview                 
                    contract={metadata?.collectionAddress} 
                    id={metadata?.tokenId} 
                    href={`https://opensea.io/assets/ethereum/${metadata?.collectionAddress}/${metadata?.tokenId}`}
                    showBids={false}
                    showPerpetual={false}
                    />
                </MediaConfiguration>                      */}
            </div>
        </div>
    )
}