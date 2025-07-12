import type { Config } from "@netlify/functions";
import { NextApiRequest, NextApiResponse } from "next";
import { createWalletClient, http, getContract } from "viem";
import { avalanche } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const EURC_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function"
  }
];

export default async function EURCTransfer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const privateKey = "5f7037dcb3065fbc734566fa2cfb7a33fd62422c76f2782797dfa06a0ede71dc"; // Remplacer par une clé privée réelle
    const from = "0x2DE81737589163266Ff70F89CCb12D0655C35853";
    const to = "0x2bA8a0CDE1F2c287d5e115B0b33c0b571493E758";
    const eurcAddress = "0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD";
    const amount = 1000000n; // 1 EURC (6 décimales)

    const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, "")}`);
    const walletClient = createWalletClient({
      account,
      chain: avalanche,
      transport: http(),
    });

    const eurcWriteContract = getContract({
      address: eurcAddress,
      abi: EURC_ABI,
      client: walletClient,
    });

    // Effectuer le transfert
    const hash = await eurcWriteContract.write.transfer([to, amount]);
    return res.status(200).json({ message: "Transfert soumis", hash });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors du transfert EURC" });
  }
}

export const config: Config = {
  schedule: "44 8 * * *"
};