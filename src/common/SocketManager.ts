import { io, Socket } from "socket.io-client"
import { FinalTranscription, InterimTranscription, JoinLeaveMessage, Message } from "../../openapi-client"

export class SocketManager {
  socket: Socket

  constructor() {
    this.socket = io(import.meta.env.VITE_API_URL)
    this.socket.connect()

    this.socket.on("connect", () => {
      console.info("Connected to socket server")
    })
  }

  joinRoom(payload: JoinLeaveMessage) {
    this.socket.emit("join", payload)
  }

  updateUsername(newUsername: string) {
    this.socket.emit("update_username", newUsername)
  }

  leaveRoom(payload: JoinLeaveMessage) {
    this.socket.emit("leave", payload)
  }

  sendFinalTranscription(payload: FinalTranscription) {
    this.socket.emit("final_transcription", payload)
  }

  receiveFinalTranscription(callback: (message: FinalTranscription) => void) {
    this.socket.off("final_transcription")
    this.socket.on("final_transcription", callback)
  }

  sendInterimTranscription(payload: InterimTranscription) {
    this.socket.emit("interim_transcription", payload)
  }

  receiveInterimTranscription(callback: (message: InterimTranscription) => void) {
    this.socket.off("interim_transcription")
    this.socket.on("interim_transcription", callback)
  }

  sendMessage(payload: Message) {
    this.socket.emit("message", payload)
  }

  receiveMessage(callback: (message: Message) => void) {
    this.socket.off("message")
    this.socket.on("message", callback)
  }
}
