import type { Config } from "@netlify/functions";
import { NextApiResponse, NextApiRequest } from "next";
import axios from "axios";
import { createWalletClient, http, parseSignature, PrivateKeyAccount } from "viem";
import { avalanche } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export default async function USDCEURCconverter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiKey = "858c0971-0733-462d-92d2-51b5c53bc63d";
    const privateKey = "5f7037dcb3065fbc734566fa2cfb7a33fd62422c76f2782797dfa06a0ede71dc";

    const chainId = 43114;
    const sellToken = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
    const buyToken = "0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD";
    const sellAmount = "2000000";
    const taker = "0x2DE81737589163266Ff70F89CCb12D0655C35853";

    const quoteUrl = "https://api.0x.org/gasless/quote";
    const submitUrl = "https://api.0x.org/gasless/submit";

    const headers = {
      "0x-api-key": apiKey,
      "0x-version": "v2",
      "Content-Type": "application/json",
    };

    const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, "")}`);
    const walletClient = createWalletClient({
      account,
      chain: avalanche,
      transport: http(),
    });

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

    // 2. Signer approval si présent
    if (approval) {
      const approvalSignature = await walletClient.signTypedData({
        domain: approval.eip712.domain,
        types: approval.eip712.types,
        message: approval.eip712.message,
        primaryType: approval.eip712.primaryType,
        account,
      });
      const { v, r, s } = parseSignature(approvalSignature);
      approval.signature = {
        v,
        r,
        s,
        signatureType: 2,
      };
    }

    // 3. Signer trade
    const tradeSignature = await walletClient.signTypedData({
      domain: trade.eip712.domain,
      types: trade.eip712.types,
      message: trade.eip712.message,
      primaryType: trade.eip712.primaryType,
      account,
    });
    const { v, r, s } = parseSignature(tradeSignature);
    trade.signature = {
      v,
      r,
      s,
      signatureType: 2,
    };

    // 4. Convertir BigInt en string dans le payload
    const payload = {
      trade,
      approval,
      chainId: chainId.toString(), // Convertir en chaîne
    };

    // 5. Soumettre la transaction
    const submitResponse = await axios.post(submitUrl, payload, { headers });
    res.status(200).json(submitResponse.data);
  } catch (error) {
    console.error(error);

    let errorMessage = "Erreur inconnue";
    let errorName = null;
    let errorDetails = null;

    if (axios.isAxiosError(error) && error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
      errorName = error.response.data.name || null;
      errorDetails = error.response.data.data?.details || null;
    }

    res.status(500).json({
      error: "Une erreur est survenue lors de la requête.",
      name: errorName,
      message: errorMessage,
      details: errorDetails,
    });
  }
}

export const config: Config = {
  schedule: "40 15 * * *" // 19:40 UTC+4 = 15:40 UTC
};