import type { NextPage } from 'next'
import { Seo } from 'components'
import {AuctionContainer} from "components/auction/AuctionContainer"

const Home: NextPage = () => {

  const testContract: string = "0xa3ba36ce1af5fa6bb8ab35a61c8ae72293b38b32"; // 0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8, 0xc1e87f349c0673de48f6292e594c62b35bc270a7
  // 0xa3ba36ce1af5fa6bb8ab35a61c8ae72293b38b32 token 1 has a completed NOT settled auction
  const testId: string = "6";

  return (
    <>
      <section id="home-page" className="pb-6 flex flex-row justify-center items-start h-screen text-black">
        <AuctionContainer collectionAddress={testContract} tokenId={testId} />
      </section>
      {/* <Seo/> */}
    </>
  )
}

export default Home
