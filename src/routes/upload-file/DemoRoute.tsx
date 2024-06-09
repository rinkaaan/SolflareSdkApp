import {Button, Container, ContentLayout, Header, TextContent} from "@cloudscape-design/components"
import {useEffect} from "react"
import {appDispatch} from "../../common/store.ts"
import {mainActions} from "../mainSlice.ts"
import Solflare from "@solflare-wallet/sdk"
import {Connection, PublicKey, Transaction} from "@solana/web3.js"
import {createTransferInstruction, TOKEN_PROGRAM_ID,} from "@solana/spl-token"


export function Component() {
  let wallet: Solflare
  let connection: Connection

  useEffect(() => {
    wallet = new Solflare()
    wallet.on("connect", () => console.log("connected", wallet.publicKey?.toString()))
    wallet.on("disconnect", () => console.log("disconnected"))
    wallet.connect()

    const url = import.meta.env.VITE_ALCHEMY_MAINNET_URL as string
    connection = new Connection(url)
  }, [])

  // const SOL_LAMPORTS = 1000000000
  const USDC_PUBKEY = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",);

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
      )[0];
    }

    const fromTokenAccount = findAssociatedTokenAddress(wallet.publicKey!)
    const toTokenAccount = findAssociatedTokenAddress(new PublicKey('nkDyvnuXzjGH9dv1jwpWg8u3sRoTqdfL2zU1R38YUke'));

    function usdToLamports(usd: number) {
      return usd * Math.pow(10, 6)
    }

    const transaction = new Transaction().add(
        createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            wallet.publicKey!,
            // .001 * SOL_LAMPORTS,
            usdToLamports(0.05),
            [],
            TOKEN_PROGRAM_ID
        ),
    );

    transaction.feePayer = wallet.publicKey!
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    return transaction
  }

  async function handleSignAndSend() {
    // const transaction = await createTransferTransaction()
    const transaction = await createTransferTransactionUsdc()
    const tx = await wallet.signAndSendTransaction(transaction)
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
          <Button onClick={handleSignAndSend}>Sign and send</Button>
          {/*<Button onClick={createTransferTransactionUsdc}>Sign and send USDC</Button>*/}
        </Container>
      </ContentLayout>
  )
}
