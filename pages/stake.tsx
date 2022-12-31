import { NextPage } from "next"
import { PublicKey } from "@solana/web3.js"
import { useState, useEffect, useMemo, MouseEventHandler, useCallback } from 'react'
import { StakeOptionsDisplay } from '../components/StakeOptionsDisplay'
import MainLayout from "../components/MainLayout"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { run } from "node:test"

interface StakeProps {
  mint: PublicKey
  imageSrc: string
}

const Stake: NextPage<StakeProps> = ({ mint, imageSrc }) => {
  const [isStaking, setIsStaking] = useState(false)
  const [level, setLevel] = useState(1)
  const [nftData, setNftData] = useState<any>()
  const walletAdapter = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(walletAdapter)
    )

    try {
      metaplex
        .nfts()
        .findByMint({ mintAddress: mint })
        .run()
        .then((nft) => {
          console.log("nft data on stake page:", nft)
          setNftData(nft)
        })
    } catch (e) {
      console.log("error getting nft:", e)
    }
  }, [connection, walletAdapter])

  return (
    <MainLayout>
      <StakeOptionsDisplay isStaked={isStaking} nftData={nftData}
        daysStaked={10} totalEarned={20} claimable={10}
      />
    </MainLayout>
  )
}

Stake.getInitialProps = async ({ query }: any) => {
  const { mint, imageSrc } = query

  if (!mint || !imageSrc) throw { error: "no mint" }

  try {
    const mintPubkey = new PublicKey(mint)
    return { mint: mintPubkey, imageSrc: imageSrc }
  } catch {
    throw { error: "invalid mint" }
  }
}

export default Stake
