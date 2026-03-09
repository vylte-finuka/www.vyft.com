// config.ts ou walletconfig.ts
import type { CustomCaipNetwork } from '@reown/appkit-common'
import { UniversalConnector } from '@reown/appkit-universal-connector'

export const projectId = "3dc309f3ebac775983d3ff51213bea14"

export const sluraCharene: CustomCaipNetwork<'eip155'> = {
  id: 45057,
  chainNamespace: 'eip155' as const,
  caipNetworkId: 'eip155:45057',
  name: 'Slura devnet',
  nativeCurrency: {
    name: 'Vyft Enhancing ZER',
    symbol: 'VEZ',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://4ea9-168-253-182-87.ngrok-free.app']
    },
    public: {
      http: ['https://4ea9-168-253-182-87.ngrok-free.app']
    }
  },
  blockExplorers: {
    default: {
      name: 'SluraScan',
      url: 'https://explorer-testnet.slura.network'
    }
  },
  contracts: {}
}

export async function getUniversalConnector() {
  const universalConnector = await UniversalConnector.init({
    projectId,
    metadata: {
      name: 'Vyft Slura',
      description: 'Vyft: La néobanque à la vertu de la finance.',
      url: 'https://www.vylte-finuka.com/fr-FR/ecosystem/vyft-slura',
      // Icône de l'application (affichée dans le modal WalletConnect et signatures)
      icons: [
        '/Slura.png',  // ← fichier local dans public/ (prioritaire en dev/prod)
        "https://raw.githubusercontent.com/vylte-finuka/Slura/refs/heads/master/crates/vuc-platform/src/asset/Slura.png"  // fallback GitHub
      ]
    },
    networks: [
      {
        methods: [
          'eth_sendTransaction',
          'personal_sign',
          'eth_signTypedData_v4',
          'wallet_switchEthereumChain',
          'wallet_addEthereumChain',
          'wallet_watchAsset'  // ← obligatoire pour pouvoir ajouter VEZ après
        ],
        chains: [sluraCharene],
        events: ['chainChanged', 'accountsChanged'],
        namespace: 'eip155'
      }
    ]
  })

  return universalConnector
}
