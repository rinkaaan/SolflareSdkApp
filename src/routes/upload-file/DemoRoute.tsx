import {
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  TextContent
} from "@cloudscape-design/components"
import {useEffect, useRef, useState} from "react"
import {appDispatch} from "../../common/store.ts"
import {mainActions} from "../mainSlice.ts"
import {Keypair, PublicKey} from "@solana/web3.js"
import BigNumber from "bignumber.js"
import {createQR, encodeURL} from "@solana/pay"
import {TOKEN_PROGRAM_ID} from "@solana/spl-token"
import solanaPayButtonSvg from "../../assets/solana_pay.svg"
import Link from "@cloudscape-design/components/link"

export function Component() {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  function findAssociatedTokenAddress(
      walletAddress: PublicKey
  ): PublicKey {
    return PublicKey.findProgramAddressSync(
        [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          USDC_PUBKEY.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )[0]
  }

  useEffect(() => {
    const toTokenAccount = findAssociatedTokenAddress(new PublicKey("nkDyvnuXzjGH9dv1jwpWg8u3sRoTqdfL2zU1R38YUke"))
    const reference = new Keypair().publicKey

    const paymentUrl = encodeURL({
      recipient: toTokenAccount,
      amount: new BigNumber(.01),
      splToken: USDC_PUBKEY,
      reference,
      label: "Rinkagu",
      message: "Usage fee for 1 month"
    })
    setPaymentUrl(paymentUrl.href)
    const qrCode = createQR(paymentUrl, 200)
    if (qrCodeRef.current && qrCodeRef.current.children.length === 0) {
      qrCode.append(qrCodeRef.current!)
    }
  }, [])

  const USDC_PUBKEY = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",)

  useEffect(() => {
    appDispatch(mainActions.updateSlice({tools: undefined, toolsHidden: false}))
    return () => {
      appDispatch(mainActions.updateSlice({toolsHidden: true}))
    }
  }, [])

  return (
      <ContentLayout
          header={
            <Header variant="h1">Billing</Header>
          }
      >
        <Container>
          <TextContent>
            <p>
              To pay, scan the QR code below with your wallet or tap the Solana Pay button below if you're on mobile and have a <Link external variant="secondary" href="https://docs.solanapay.com/#supporting-wallets"> Solana Pay compatible wallet</Link> such as Solflare installed.
            </p>
          </TextContent>
          <SpaceBetween size="xxxs" direction="vertical" alignItems="center">
            <div ref={qrCodeRef}/>
            <a href={paymentUrl!} rel="noreferrer">
              <img src={solanaPayButtonSvg} alt="Pay"/>
            </a>
          </SpaceBetween>
        </Container>
      </ContentLayout>
  )
}
