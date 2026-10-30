# FoundIt 🔍

> **Tagline:** Lost something? Find it here.

FoundIt is a modern, lightweight, decentralized lost-and-found board built on the **Botchain Testnet**. It enables users to connect their MetaMask wallet, publish lost or found items directly onto the blockchain, filter and explore active listings, and manage (resolve or delete) their own entries securely.

---

## ✨ Features

- **Decentralized On-Chain Storage**: All items are permanently and transparently recorded on the Botchain blockchain.
- **MetaMask Integration**: Connect and interact directly using MetaMask via `wagmi` and `viem`.
- **Live Statistics**: Real-time counter of total listings, lost items, found items, and resolved cases.
- **Item Publishing**: Clean, intuitive form to publish Lost or Found listings with on-chain transaction receipts.
- **Privacy & Safety First**: Explicit guidance against publishing sensitive personal information (phones, home addresses, government IDs).
- **Filtering & Search**: Quickly toggle between *All Items*, *Lost*, *Found*, *Resolved*, and *My Listings*, alongside real-time keyword/location search.
- **Ownership Management**: Only the original poster can mark an item as resolved or soft-delete it.
- **Dark Premium UI**: Charcoal dark mode (`#0f1013`) styled with muted purple and emerald accents, rounded card design, and subtle hover animations.

---

## ⛓️ Blockchain Network Details

FoundIt is pre-configured for the **Botchain Testnet**:

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |
| **Currency Symbol** | `BOHR` |

---

## 🏗️ Tech Stack

- **Smart Contract**: Solidity (`^0.8.20`), Hardhat
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Web3 Client**: Wagmi v2, Viem v2, TanStack React Query v5
- **Icons**: Lucide React

---

## 🚀 Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MetaMask](https://metamask.io/) browser extension installed
- A funded Botchain Testnet wallet (if deploying contracts or creating listings)

### 2. Installation

Clone or open the repository folder and install dependencies:

```bash
npm install
```

### 3. Smart Contract Compilation & Testing

Compile the Solidity smart contract:
```bash
npx hardhat compile
```

Run the automated test suite:
```bash
npx hardhat test
```

### 4. Deploying to Botchain Testnet

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Add your deployer wallet private key to `.env.local`:
   ```env
   PRIVATE_KEY="your_private_key_here"
   ```
3. Run the deployment script:
   ```bash
   npm run deploy
   ```
4. Copy the deployed contract address and set it in `.env.local`:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."
   ```

### 5. Running the Frontend

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Smart Contract Architecture

The `FoundIt.sol` contract contains the following core mechanisms:

- **`createListing(string _name, string _description, string _location, ListingType _type)`**:
  Validates non-empty input strings, creates a new listing struct with timestamp and poster address, increments counter, and emits `ListingCreated`.
- **`resolveListing(uint256 _id)`**:
  Restricted to `msg.sender == listing.poster`. Marks `isResolved = true` and emits `ListingResolved`.
- **`deleteListing(uint256 _id)`**:
  Restricted to `msg.sender == listing.poster`. Soft-deletes the listing and emits `ListingDeleted`.
- **`getAllListings()`**:
  Returns all active (non-deleted) listings.
- **`getMyListings()`**:
  Returns all active listings posted by the calling wallet.

---

## 🛡️ Security & Privacy Notice

All listing information (item names, descriptions, locations, poster wallet addresses) is stored on a public blockchain. Users should:
- Never disclose exact home addresses, phone numbers, passport/national ID numbers, or financial details.
- Provide general public locations (e.g., *"Downtown Library, 2nd floor reading hall"*).

---

## 📄 License

MIT

