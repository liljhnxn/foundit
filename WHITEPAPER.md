# FoundIt: Whitepaper & Pitch Deck Overview
**Tagline:** *Lost something? Find it here.*  
**Network:** Botchain Mainnet (Chain ID: `677`)  
**Contract Address:** `0xBb7dc02D4F4f28471b2a0740B12fdABF05A991B1`  
**Explorer:** [https://scan.botchain.ai/address/0xBb7dc02D4F4f28471b2a0740B12fdABF05A991B1](https://scan.botchain.ai/address/0xBb7dc02D4F4f28471b2a0740B12fdABF05A991B1)  
**Repository:** [https://github.com/liljhnxn/foundit](https://github.com/liljhnxn/foundit)  

---

# SECTION 1: THE WHITEPAPER

## 1. Executive Summary
Every year, millions of valuable personal items—wallets, electronics, keys, bags, and documents—are misplaced in public spaces. Traditional lost-and-found infrastructures are fragmented, centralized, and inefficient: physical boards are geographically bound, social media posts get buried by algorithms, and centralized apps create privacy hazards by collecting personal identifiers.

**FoundIt** introduces a decentralized, tamper-proof, community-driven lost-and-found registry deployed on the **Botchain Mainnet**. By utilizing public EVM smart contracts, FoundIt enables peer-to-peer accountability, transparent lifecycle tracking, and permissionless listing management without reliance on intermediaries or centralized databases.

---

## 2. Problem Statement
1. **Fragmentation & Inaccessibility:** Current solutions rely on localized notice boards, campus desks, or ad-hoc social groups. There is no unified, tamper-proof repository.
2. **Centralized Vulnerabilities & Censorship:** Centralized platforms can alter or delete records, suffer downtime, and lock user data within walled gardens.
3. **Privacy Hazards (PII Leaks):** Traditional platforms encourage posting phone numbers, home addresses, or identification documents, creating identity theft and phishing risks.
4. **Lack of Provenance & Ownership:** On centralized platforms, anyone can claim to be an item's owner or delete community posts without cryptographic verification.

---

## 3. The FoundIt Solution
FoundIt bridges the gap between honest finders and worried owners through decentralized technology:

* **Cryptographic Ownership:** All listings are tied to an Ethereum-compatible address (MetaMask). Only the cryptographic owner can mark an item as resolved or delete it.
* **100% On-Chain Storage:** Item attributes (title, description, general location, type, timestamp, resolution state) live permanently on the Botchain blockchain.
* **Privacy-First Protocol:** Standardized public guidelines discourage disclosing PII and enforce the use of public landmarks instead of private addresses.
* **Lightweight & High-Throughput:** Designed with a gas-conscious Solidity architecture tailored for fast confirmations and micro-gas costs on Botchain.

---

## 4. Technical Architecture

### 4.1. Network Specifications
* **Network:** Botchain Mainnet
* **Chain ID:** `677`
* **RPC Endpoint:** `https://rpc.botchain.ai`
* **Block Explorer:** `https://scan.botchain.ai`
* **Native Currency:** `BOT` (Total Supply: 150M)

### 4.2. Smart Contract Architecture (`FoundIt.sol`)
The contract maintains an indexed storage mapping and state counter:

```solidity
enum ListingType { Lost, Found }

struct Listing {
    uint256 id;
    string name;
    string description;
    string location;
    ListingType listingType;
    address poster;
    uint256 timestamp;
    bool isResolved;
    bool isDeleted;
}
```

#### Core Methods:
- `createListing(string _name, string _description, string _location, ListingType _type)`:
  Validates input non-emptiness, increments counter, writes struct to storage, and emits `ListingCreated`.
- `resolveListing(uint256 _id)`:
  Enforces `msg.sender == listing.poster`. Marks `isResolved = true` and emits `ListingResolved`.
- `deleteListing(uint256 _id)`:
  Enforces `msg.sender == listing.poster`. Sets `isDeleted = true` (soft delete) and emits `ListingDeleted`.
- `getAllListings()`:
  Returns dynamic memory array of all active (non-deleted) listings.
- `getMyListings()`:
  Filters and returns listings belonging exclusively to `msg.sender`.

### 4.3. Frontend & Client Stack
* **Framework:** Next.js 14 (App Router, Server-Side Static Generation + Client Hydration)
* **Web3 Integration:** Wagmi v2 + Viem v2 + TanStack React Query v5
* **Styling & Design System:** Tailwind CSS with Dark Charcoal palette (`#0c0d0f`, `#121316`), muted purple (`#9333ea`) and emerald accents (`#10b981`).

---

## 5. Security & Privacy Framework
* **Access Control:** Resolving and deleting listings is guarded by custom error reverts (`NotListingOwner`).
* **Input Sanitization:** Byte-length checks reject blank entries at the contract layer.
* **Privacy by Design:** Interface encourages general public landmarks and explicitly warns against disclosing personal phone numbers, identity numbers, or home addresses.

---

# SECTION 2: PITCH DECK SLIDE OUTLINE

### Slide 1: Cover / Title
* **Title:** FoundIt
* **Tagline:** Lost something? Find it here.
* **Subtitle:** Decentralized Lost-and-Found Protocol on Botchain.
* **Links:** Web App, GitHub, Explorer Contract.

### Slide 2: The Problem
* Physical lost-and-found desks are siloed and inaccessible.
* Social media boards are transient, unsearchable, and algorithm-dependent.
* Existing web platforms harvest sensitive PII (phone numbers, addresses).
* Zero cryptographic verification of original posters.

### Slide 3: The Solution
* FoundIt: A single, open, immutable lost-and-found board on Botchain.
* Connect with MetaMask in one click.
* Post lost or found items directly to the blockchain.
* Manage, resolve, or remove your items securely using your private key.

### Slide 4: Market & Target Audience
* **University Campuses & Student Unions:** High daily turnover of lost student cards, notebooks, and electronics.
* **Conferences & Events (Web3 & Tech):** Rapid recovery of badges, wallets, chargers, and hardware keys.
* **Public Venues & Transit Hubs:** Transparent community board without administrative gatekeepers.

### Slide 5: Product Features
* **Real-Time Board:** Active vs. Resolved badge tracking.
* **Multi-Filter Engine:** Seamlessly toggle *All Items*, *Lost*, *Found*, *Resolved*, and *My Listings*.
* **Live On-Chain Statistics:** Live query of global platform recovery metrics.
* **Dark Charcoal UI:** Minimalist, modern Web3 aesthetic with responsive mobile support.

### Slide 6: Technology & Infrastructure
* **Smart Contract:** Solidity `^0.8.20` with custom errors for gas efficiency.
* **Network:** BOT Chain Mainnet (Chain ID: 677) with verified code on `scan.botchain.ai`.
* **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + Wagmi/Viem.

### Slide 7: BOT Chain Ecosystem Value
* Real-world consumer utility showcasing fast transactions and low fees on BOT Chain.
* Onboarding non-crypto users through an intuitive, practical daily application.
* Public smart contract demonstrating BOT Chain's EVM compatibility and indexing.

### Slide 8: Roadmap & Milestones
* **Phase 1 (Completed):** Smart contract deployment & verification on BOT Chain Mainnet, complete responsive dApp, automated test suites (13/13 passing).
* **Phase 2:** Optional zero-knowledge anonymous claims and encrypted finder-to-owner messaging via Web3 protocols (e.g., XMTP / Waku).
* **Phase 3:** Automated bounty rewards in native BOT tokens for verified item returns.
* **Phase 4:** Global expansion, campus pilots, and conference partnership programs.

### Slide 9: Co-Marketing & Ecosystem Ask
* Feature in Botchain official social media announcements (X, Telegram, Discord).
* Official directory listing on Botchain DApp ecosystem portal.
* Co-hosted X Space / AMA demonstrating daily dApp utility on Botchain.
* Developer spotlight in Botchain ecosystem newsletter.

### Slide 10: Conclusion & Contact
* **Try the DApp:** [http://localhost:3000](http://localhost:3000)
* **GitHub Repository:** [https://github.com/liljhnxn/foundit](https://github.com/liljhnxn/foundit)
* **Verified Contract:** `0xBb7dc02D4F4f28471b2a0740B12fdABF05A991B1` (Chain ID: 677)
