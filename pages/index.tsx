import type { NextPage } from 'next'
import {AuctionContainer} from "components/auction/AuctionContainer"

const Home: NextPage = () => {

  const collection: string = "0x1B9EEA219DD5a1ba5f97E08956165F1220879b1b";

  return (
    <>
      <section id="home-page" className="grid grid-cols-1 space-y-20 items-start h-screen text-black">
        <AuctionContainer collectionAddress={collection} tokenId={"3"} />
        <AuctionContainer collectionAddress={collection} tokenId={"4"} />
        <AuctionContainer collectionAddress={collection} tokenId={"5"} />
        <AuctionContainer collectionAddress={collection} tokenId={"6"} />
        <AuctionContainer collectionAddress={collection} tokenId={"7"} />
        <div className="text-[12px] pb-8 text-black flex flex-row justify-center" >
            presented by&nbsp;
          <a className="hover:text-blue-500"href="https://feltzine.art">
            feltzine
          </a>
          <a className="hover:text-yellow-400" href="https://zora.co/">
            zora
          </a>
          <a className="hover:text-[#ff89de]" href="https://www.public---assembly.com/">
            pblcasmbly
          </a>
        </div>
      </section>

    </>
  )
}

export default Home
