import type { Config } from "@netlify/functions";
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
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  }
];

export default async function handler() {
  try {
    const privateKey = "5f7037dcb3065fbc734566fa2cfb7a33fd62422c76f2782797dfa06a0ede71dc";
    const from = "0x2DE81737589163266Ff70F89CCb12D0655C35853";
    const to = "0x2bA8a0CDE1F2c287d5e115B0b33c0b571493E758";
    const eurcAddress = "0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD";
    const amount = "1000000"; // 1 EURC (6 décimales)

    const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, "")}`);
    const walletClient = createWalletClient({
      account,
      chain: avalanche,
      transport: http(),
    });

    const eurcContract = getContract({
      address: eurcAddress,
      abi: EURC_ABI,
      client: walletClient,
    });

    // Vérifier le solde
    const balance: bigint = BigInt(await eurcContract.read.balanceOf([from]) as string);
    if (balance < BigInt(amount)) {
      return new Response(JSON.stringify({ message: "Solde EURC insuffisant." }), { status: 200 });
    }

    // Effectuer le transfert
    const hash = await eurcContract.write.transfer([to, amount]);
    return new Response(JSON.stringify({ message: "Transfert soumis", hash }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erreur lors du transfert EURC" }), { status: 500 });
  }
}

export const config: Config = {
  schedule: "3 10 * * *" // 14:03 UTC+4 = 10:03 UTC
};