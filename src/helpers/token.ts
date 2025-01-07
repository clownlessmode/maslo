import { sha256 } from "js-sha256"

export interface TokenData {
  TerminalKey: string
  Amount: number // Changed from string to number
  OrderId: string
  Description: string
  Password: string
}

// Replace 'crypto' with a third-party SHA-256 implementation like 'js-sha256'
// Ensure to install the 'js-sha256' package: npm install js-sha256

export async function generateToken(data: TokenData): Promise<string> {
  const sortedKeys = [
    "TerminalKey",
    "Amount",
    "OrderId",
    "Description",
    "Password",
  ].sort()
  const concatenatedString = sortedKeys
    .map((key) => data[key as keyof TokenData].toString())
    .join("")

  const token = sha256(concatenatedString)

  return token
}
