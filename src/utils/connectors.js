import { InjectedConnector } from "@web3-react/injected-connector";
import { BscConnector } from '@binance-chain/bsc-connector'
import { currentNetwork } from "./index"
import Metamask from "../icons/Metamask";



export const injectedConnector = new InjectedConnector({ supportedChainIds: [+currentNetwork] });

export const bscConnector = new BscConnector({ supportedChainIds: [+currentNetwork] })

export function getConnector(connectorId) {
  switch (connectorId) {
    case "injectedConnector":
      return injectedConnector; 
    default:
      return injectedConnector;
  }
}

export const connectorsByName = {
  'Injected': injectedConnector 
}

export const connectors = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: injectedConnector,
    key: "injectedConnector",
  },  
]

export const connectorLocalStorageKey = "connectorId";