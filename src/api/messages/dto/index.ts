export class MessageProps {
  text: string
  sendNumber: string
  receiverNumber: string
  telephoneEncodedText: string
}

export class MessagesUi {
  text?: string
  sendNumber?: string
  receiverNumber?: string
  formattedReceiverNumber?: string
  telephoneEncodedText?: string
  createdAt?: Date
  formattedCreatedAt?: string
}
