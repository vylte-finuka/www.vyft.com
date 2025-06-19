import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Validation des variables d'environnement
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY non défini');
}
if (!process.env.BITPANDA_API_KEY) {
  throw new Error('BITPANDA_API_KEY non défini');
}
if (!process.env.BANK_ACCOUNT_ID || !process.env.PERSONAL_BANK_ACCOUNT_ID) {
  throw new Error('BANK_ACCOUNT_ID ou PERSONAL_BANK_ACCOUNT_ID non défini');
}
if (!process.env.AVALANCHE_WALLET_ADDRESS) {
  throw new Error('AVALANCHE_WALLET_ADDRESS non défini');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BITPANDA_API_BASE_URL = 'https://api.bitpanda.com/v1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { connectedAccountId } = req.body;

  if (!connectedAccountId) {
    return res.status(400).json({ error: 'ID du compte connecté requis' });
  }

  try {
    // Vérifier le solde Stripe Connect
    const balance = await stripe.balance.retrieve({ stripeAccount: connectedAccountId });
    const eurBalance = balance.available.find(b => b.currency === 'eur');
    const availableEUR = eurBalance ? eurBalance.amount / 100 : 0;

    if (availableEUR < 100) {
      return res.status(400).json({ error: 'Solde insuffisant (minimum 100 EUR)' });
    }

    // Répartition : 40 % conservés, 60 % pour EURC
    const amountForPurchase = availableEUR * 0.6;
    const amountToKeep = availableEUR * 0.4;
    if (amountForPurchase < 100) {
      return res.status(400).json({ error: 'Montant pour EURC insuffisant (minimum 100 EUR)' });
    }

    // Virement des 60 % pour l'achat
    const purchasePayout = await stripe.payouts.create(
      {
        amount: Math.floor(amountForPurchase * 100), // En centimes
        currency: 'eur',
        destination: process.env.BANK_ACCOUNT_ID,
      },
      { stripeAccount: connectedAccountId }
    );

    // Virement des 40 % conservés
    const keepPayout = await stripe.payouts.create(
      {
        amount: Math.floor(amountToKeep * 100),
        currency: 'eur',
        destination: process.env.PERSONAL_BANK_ACCOUNT_ID,
      },
      { stripeAccount: connectedAccountId }
    );

    // Dépôt SEPA vers Bitpanda (manuel)
    console.log(`Initiation manuelle d'un dépôt SEPA de ${amountForPurchase} EUR vers Bitpanda requise.`);

    // Vérifier solde EUR via /fiatwallets
    const fiatWalletsResponse = await axios.get(`${BITPANDA_API_BASE_URL}/fiatwallets`, {
      headers: { Authorization: `Bearer ${process.env.BITPANDA_API_KEY}` },
    });
    const eurWallet = fiatWalletsResponse.data.data.find((wallet: { attributes: { fiat_symbol: string; }; }) => wallet.attributes.fiat_symbol === 'EUR');
    if (!eurWallet) {
      return res.status(400).json({ error: 'Wallet EUR non trouvé sur Bitpanda' });
    }
    const bitpandaEURBalance = parseFloat(eurWallet.attributes.balance);

    if (bitpandaEURBalance < amountForPurchase) {
      return res.status(400).json({ error: 'Solde EUR insuffisant sur Bitpanda' });
    }

    // Acheter EURC via /orders
    const orderResponse = await axios.post(
      `${BITPANDA_API_BASE_URL}/orders`,
      {
        instrument_code: 'EURC_EUR', // À confirmer avec Bitpanda
        side: 'BUY',
        type: 'MARKET',
        amount: amountForPurchase.toString(),
      },
      { headers: { Authorization: `Bearer ${process.env.BITPANDA_API_KEY}` } }
    );

    // Vérifier wallet EURC via /wallets
    const cryptoWalletsResponse = await axios.get(`${BITPANDA_API_BASE_URL}/wallets`, {
      headers: { Authorization: `Bearer ${process.env.BITPANDA_API_KEY}` },
    });
    const eurcWallet = cryptoWalletsResponse.data.data.find((wallet: { attributes: { cryptocoin_symbol: string; }; }) => wallet.attributes.cryptocoin_symbol === 'EURC');
    if (!eurcWallet) {
      return res.status(400).json({ error: 'Wallet EURC non trouvé sur Bitpanda' });
    }

    // Retirer EURC vers Avalanche via /withdrawals
    const withdrawalResponse = await axios.post(
      `${BITPANDA_API_BASE_URL}/withdrawals`,
      {
        wallet_id: eurcWallet.id,
        amount: amountForPurchase.toString(),
        destination: {
          address: process.env.AVALANCHE_WALLET_ADDRESS,
          blockchain: 'AVALANCHE',
        },
      },
      { headers: { Authorization: `Bearer ${process.env.BITPANDA_API_KEY}` } }
    );

    console.log(`Répartition - Conservés: ${amountToKeep} EUR, Utilisés pour EURC: ${amountForPurchase} EUR`);

    return res.status(200).json({
      message: 'Achat et retrait EURC sur Avalanche initiés avec succès',
      purchasePayoutId: purchasePayout.id,
      keepPayoutId: keepPayout.id,
      orderId: orderResponse.data.data.id,
      withdrawalId: withdrawalResponse.data.data.id,
      amountForPurchase,
      amountKept: amountToKeep,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur:', errorMessage);
    return res.status(500).json({ error: `Erreur lors du traitement: ${errorMessage}` });
  }
}