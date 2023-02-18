//@ts-nocheck
import { useMemo } from "react"
import { useEnsName } from "wagmi"
import { shortenAddress } from "utils"

export function EnsResolution({metadata}: any) {

    const address = metadata ? metadata.mintInfo.originatorAddress : ""

    const { data: ensName } = useEnsName({
        address: address as string | undefined,
    })

    const bidder = useMemo(() => 
    ensName ? ensName : shortenAddress(address)
    , [ensName, address])

    return (
        bidder 
    )
}