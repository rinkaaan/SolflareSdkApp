import {Button, Container, ContentLayout, Header, TextContent} from "@cloudscape-design/components"
import {useEffect, useState} from "react"
import {appDispatch} from "../../common/store.ts"
import {mainActions} from "../mainSlice.ts"
import Solflare from "@solflare-wallet/sdk"
import {Connection, Keypair, PublicKey, Transaction} from "@solana/web3.js"
import {createTransferInstruction, TOKEN_PROGRAM_ID,} from "@solana/spl-token"
import BigNumber from "bignumber.js"
import {encodeURL} from "@solana/pay"

function checkURLScheme(scheme, callback) {
  // Create a hidden iframe
  const iframe = document.createElement("iframe")
  iframe.style.display = "none"

  // Attach an onload event to the iframe
  iframe.onload = function () {
    // Onload is triggered, assume the scheme is supported
    callback(true)
    document.body.removeChild(iframe)
  }

  // Attach an onerror event to the iframe
  iframe.onerror = function () {
    // Onerror is triggered, assume the scheme is not supported
    callback(false)
    document.body.removeChild(iframe)
  }

  // Append the iframe to the body
  document.body.appendChild(iframe)

  // Set the src to the URL with the desired scheme
  iframe.src = scheme + "://test-url"

  // Fallback check after a timeout in case neither onload nor onerror is triggered
  setTimeout(function () {
    if (document.body.contains(iframe)) {
      callback(false)
      document.body.removeChild(iframe)
    }
  }, 2000) // Adjust timeout as needed
}

export function Component() {
  // let wallet: Solflare
  const [wallet, setWallet] = useState<Solflare | null>(null)
  // let connection: Connection
  const [connection, setConnection] = useState<Connection | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [solanaSchemeSupported, setSolanaSchemeSupported] = useState<boolean | null>(null)

  useEffect(() => {
    const url = import.meta.env.VITE_ALCHEMY_MAINNET_URL as string
    const newConnection = new Connection(url)
    setConnection(newConnection)

    // wallet = new Solflare()
    // wallet.on("connect", () => console.log("connected", wallet.publicKey?.toString()))
    // wallet.on("disconnect", () => console.log("disconnected"))
    // wallet.connect()

    checkURLScheme("solana", (supported) => {
      // alert("Solana scheme supported: " + supported)
      console.log("Solana scheme supported: " + supported)
      setSolanaSchemeSupported(supported)

      if (supported) {
        const recipient = new PublicKey("nkDyvnuXzjGH9dv1jwpWg8u3sRoTqdfL2zU1R38YUke")
        const amount = new BigNumber(5)
        const reference = new Keypair().publicKey
        const label = "Jungle Cats store"
        const message = "Jungle Cats store - your order - #001234"
        const memo = "JC#4098"
        const paymentUrl = encodeURL({recipient, amount, reference, label, message, memo})
        setPaymentUrl(paymentUrl.href)
      } else {
        const newWallet = new Solflare()
        newWallet.on("connect", () => console.log("connected", newWallet.publicKey?.toString()))
        newWallet.on("disconnect", () => console.log("disconnected"))
        newWallet.connect()
        setWallet(newWallet)
      }
    })
  }, [])

  // const SOL_LAMPORTS = 1000000000
  const USDC_PUBKEY = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",)

  // async function createTransferTransaction() {
  //   const transaction = new Transaction().add(
  //     SystemProgram.transfer({
  //       fromPubkey: wallet.publicKey!,
  //       toPubkey: new PublicKey("nkDyvnuXzjGH9dv1jwpWg8u3sRoTqdfL2zU1R38YUke"),
  //       lamports: .001 * SOL_LAMPORTS,
  //     })
  //   )
  //   transaction.feePayer = wallet.publicKey!
  //   transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  //   return transaction
  // }

  async function createTransferTransactionUsdc() {
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

    console.log("Creating transfer transaction...")
    console.log(wallet)
    const fromTokenAccount = findAssociatedTokenAddress(wallet.publicKey!)
    const toTokenAccount = findAssociatedTokenAddress(new PublicKey("nkDyvnuXzjGH9dv1jwpWg8u3sRoTqdfL2zU1R38YUke"))

    function usdToLamports(usd: number) {
      return usd * Math.pow(10, 6)
    }

    const transaction = new Transaction().add(
        createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            wallet!.publicKey!,
            // .001 * SOL_LAMPORTS,
            usdToLamports(0.05),
            [],
            TOKEN_PROGRAM_ID
        ),
    )

    transaction.feePayer = wallet!.publicKey!
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    return transaction
  }

  async function handleSignAndSend() {
    // const transaction = await createTransferTransaction()
    const transaction = await createTransferTransactionUsdc()
    const tx = await wallet!.signAndSendTransaction(transaction)
    console.log(tx)
    const latestBlock = await connection.getLatestBlockhash()
    console.log("Calling confirmTransaction...")
    const res = await connection.confirmTransaction({
      signature: tx,
      lastValidBlockHeight: latestBlock.lastValidBlockHeight,
      blockhash: latestBlock.blockhash,
    }, "processed")
    console.log("Confirm transaction result")
    console.log(res)
  }

  useEffect(() => {
    appDispatch(mainActions.updateSlice({tools: undefined, toolsHidden: false}))
    return () => {
      appDispatch(mainActions.updateSlice({toolsHidden: true}))
    }
  }, [])

  return (
      <ContentLayout
          header={
            <Header variant="h1">Upload file</Header>
          }
      >
        <Container
            header={
              <Header variant="h2">Upload file</Header>
            }
        >
          <TextContent>
            <p>
              This is a demo route for uploading a file.
            </p>
          </TextContent>
          {/*<Button onClick={handleSignAndSend}>Sign and send</Button>*/}
          {/*<Button onClick={createTransferTransactionUsdc}>Sign and send USDC</Button>*/}
          {/*<a href={paymentUrl!} rel="noreferrer">Pay</a>*/}
          {solanaSchemeSupported && <a href={paymentUrl!} rel="noreferrer">Pay</a>}
          {!solanaSchemeSupported && <Button onClick={handleSignAndSend}>Sign and send</Button>}
          {/*{!paymentUrl && <p>Loading...</p>}*/}
        </Container>
      </ContentLayout>
  )
}
