import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet } from "./chain";

export const wagmiConfig = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainMainnet.id]: http("https://rpc.botchain.ai"),
  },
  ssr: true,
});
