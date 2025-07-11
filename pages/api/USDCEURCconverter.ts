import type { Config } from "@netlify/functions";
import axios from "axios";
import { createWalletClient, http, parseSignature, getContract } from "viem";
import { avalanche } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

export default async function USDCEURCconverter() {
  const apiKey = "858c0971-0733-462d-92d2-51b5c53bc63d";
  const privateKey = "5f7037dcb3065fbc734566fa2cfb7a33fd62422c76f2782797dfa06a0ede71dc";
  const chainId = 43114;
  const sellToken = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
  const taker = "0x2DE81737589163266Ff70F89CCb12D0655C35853";
  const buyToken = "0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD";
  const sellAmount = "2000000";

  const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, "")}`);
  const walletClient = createWalletClient({
    account,
    chain: avalanche,
    transport: http(),
  });

  const usdcContract = getContract({
    address: sellToken,
    abi: USDC_ABI,
    client: walletClient,
  });

  const balance: bigint = BigInt(await usdcContract.read.balanceOf([taker]) as string);
  if (balance === 0n) {
    return new Response(JSON.stringify({ message: "Solde USDC nul, aucune opération effectuée." }), { status: 200 });
  }

  const quoteUrl = "https://api.0x.org/gasless/quote";
  const submitUrl = "https://api.0x.org/gasless/submit";
  const headers = {
    "0x-api-key": apiKey,
    "0x-version": "v2",
    "Content-Type": "application/json",
  };

  const quoteParams = {
    chainId,
    sellToken,
    buyToken,
    sellAmount,
    taker,
    swapFeeRecipient: taker,
    swapFeeBps: 100,
    swapFeeToken: sellToken,
  };

  const quoteResponse = await axios.get(quoteUrl, { params: quoteParams, headers });
  const { approval, trade } = quoteResponse.data;

  if (approval) {
    const approvalSignature = await walletClient.signTypedData({
      domain: approval.eip712.domain,
      types: approval.eip712.types,
      message: approval.eip712.message,
      primaryType: approval.eip712.primaryType,
      account,
    });
    const { v, r, s } = parseSignature(approvalSignature);
    approval.signature = { v, r, s, signatureType: 2 };
  }

  const tradeSignature = await walletClient.signTypedData({
    domain: trade.eip712.domain,
    types: trade.eip712.types,
    message: trade.eip712.message,
    primaryType: trade.eip712.primaryType,
    account,
  });
  const { v, r, s } = parseSignature(tradeSignature);
  trade.signature = { v, r, s, signatureType: 2 };

  const payload = {
    trade,
    approval,
    chainId: chainId.toString(),
  };

  const submitResponse = await axios.post(submitUrl, payload, { headers });
  return new Response(JSON.stringify({ message: "Soumission réussie", data: submitResponse.data }), { status: 200 });
};

export const config: Config = {
  schedule: "0 10 * * *" // 14:00 UTC+4 = 10:00 UTC
};