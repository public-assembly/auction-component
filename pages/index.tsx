import type { NextPage } from 'next'
import { Seo } from 'components'
import {AuctionContainer} from "components/auction/AuctionContainer"

const Home: NextPage = () => {

  const testContract: string = "0xc1e87f349c0673de48f6292e594c62b35bc270a7"; // 0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8, 0xc1e87f349c0673de48f6292e594c62b35bc270a7
  const testId: string = "1";

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
