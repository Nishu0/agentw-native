import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const aptosConfig = new AptosConfig({
  network: Network.MAINNET,
});

const aptosClient = new Aptos(aptosConfig);

/**
 * Returns the global Aptos client instance configured for mainnet
 * @returns Aptos client instance
 */
export const getAptosClient = (): Aptos => {
  return aptosClient;
};

/**
 * Creates a new Aptos client instance with custom configuration if needed
 * @param customNetwork Optional network override
 * @returns New Aptos client instance
 */
export const createAptosClient = (customNetwork: Network = Network.MAINNET): Aptos => {
  const config = new AptosConfig({
    network: customNetwork,
  });
  return new Aptos(config);
};

export default aptosClient;