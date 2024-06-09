import {Button, Container, ContentLayout, Header, TextContent} from "@cloudscape-design/components"
import {useEffect} from "react"
import {appDispatch} from "../../common/store.ts"
import {mainActions} from "../mainSlice.ts"
import Solflare from "@solflare-wallet/sdk"
import {Connection, PublicKey, SystemProgram, Transaction} from "@solana/web3.js"
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token"


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

  const SOL_LAMPORTS = 1000000000

  async function createTransferTransaction() {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: new PublicKey("nkDyvnuXzjGH9dv1jwpWg8u3sRoTqdfL2zU1R38YUke"),
        lamports: .001 * SOL_LAMPORTS,
      })
    )
    transaction.feePayer = wallet.publicKey!
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    return transaction
  }

  // async function createTransferTransaction() {
  //   const mintAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") // Replace with the actual USDC mint address
  //   // const fromTokenAccount = await getAssociatedTokenAddress(
  //   //     mintAddress,
  //   //     wallet.publicKey!,
  //   //     undefined,
  //   //     TOKEN_PROGRAM_ID,
  //   //     // put USC SPL program account below
  //   //     new PublicKey('8UJ9ZfJ7qyJ3
  //   // );
  //   // const toTokenAccount = await getAssociatedTokenAddress(
  //   //     mintAddress,
  //   //     new PublicKey('nkDyvnuXzjGH9dv1jwpWg8u3sRoTqdfL2zU1R38YUke'),
  //   //
  //   // );
  //
  //   const USDC_Token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, null)
  //
  //   const transaction = new Transaction().add(
  //       createTransferInstruction(
  //           fromTokenAccount,
  //           toTokenAccount,
  //           wallet.publicKey!,
  //           1,
  //           [],
  //           TOKEN_PROGRAM_ID
  //       ),
  //   )
  //
  //   transaction.feePayer = wallet.publicKey!
  //   transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  //   return transaction
  // }

  async function handleSignAndSend() {
    const transaction = await createTransferTransaction()
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
        </Container>
      </ContentLayout>
  )
}
