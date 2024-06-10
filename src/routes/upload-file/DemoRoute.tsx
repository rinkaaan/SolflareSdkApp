import {
  Alert,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  TextContent
} from "@cloudscape-design/components"
import {useEffect, useRef, useState} from "react"
import {Connection, Keypair, PublicKey} from "@solana/web3.js"
import BigNumber from "bignumber.js"
import {createQR, encodeURL} from "@solana/pay"
import {TOKEN_PROGRAM_ID} from "@solana/spl-token"
import solanaPayButtonSvg from "../../assets/solana_pay.svg"
import Link from "@cloudscape-design/components/link"
import {sleep} from "../../common/typedUtils.ts"
import PaymentTotalTable from "./PaymentTotalTable.tsx"

const MINUTE_SECONDS = 60

export function loader() {
  const endpoint = import.meta.env.VITE_ALCHEMY_MAINNET_URL
  return new Connection(endpoint)
}

export function Component() {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const reference = new Keypair().publicKey
  const [timeLeft, setTimeLeft] = useState(5 * MINUTE_SECONDS)
  const connection = loader()
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  async function getLatestTransaction() {
    const result = await connection!.getSignaturesForAddress(reference, undefined, "confirmed")
    return result.length > 0 ? result[0] : null
  }

  async function retryUntilSuccess() {
    while (timeLeft > 0 && !paymentSuccess) {
      const latestTransaction = await getLatestTransaction()
      console.info(latestTransaction)
      if (latestTransaction) {
        setPaymentSuccess(true)
        return
      }
      await sleep(5000)
    }
  }

  useEffect(() => {
    retryUntilSuccess()
  }, [])

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const USDC_PUBKEY = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",)

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const paymentPage = (
      <Container>
        <SpaceBetween size="m" direction="vertical">
          <TextContent>
            <p>
              Please make sure you have a <Link external variant="secondary" href="https://docs.solanapay.com/#supporting-wallets"> Solana Pay compatible wallet</Link> such as Solflare installed on your phone with enough USDC to make the payment.
            </p>
            <p>
              To pay, scan the QR code below with your phone or tap the Solana Pay button below if you're already viewing this page on your phone.
            </p>
          </TextContent>
          <PaymentTotalTable />
          <SpaceBetween size="xxxs" direction="vertical" alignItems="center">
            <div ref={qrCodeRef}/>
            <SpaceBetween size="m" direction="vertical" alignItems="center">
              <a href={paymentUrl!} rel="noreferrer" className=".no-select">
                <img src={solanaPayButtonSvg} alt="Pay"/>
              </a>
              <TextContent>
                <p>{formatTime(timeLeft)} left to send payment...</p>
              </TextContent>
            </SpaceBetween>
          </SpaceBetween>
        </SpaceBetween>
      </Container>
  )

  const paymentSuccessPage = (
      <Container>
        <Alert
          statusIconAriaLabel="Success"
          type="success"
        >
          Payment successful! You can close this page now.
        </Alert>
      </Container>
  )

  return (
      <ContentLayout
          header={
            <Header variant="h1">Billing</Header>
          }
      >
        {!paymentSuccess && paymentPage}
        {paymentSuccess && paymentSuccessPage}
      </ContentLayout>
  )
}
