import { Contract } from '@ethersproject/contracts'
import TokenABI from '../contracts/Token.json'
import IsableTorronNFTABI from '../contracts/IsableTorronNFT.json'
import IsableTorronMarketABI from '../contracts/IsableTorronMarket.json'

export const currentNetwork = process.env.REACT_APP_NETWORK_ID;

export const CONTRACTS_BY_NETWORK = {
  [currentNetwork]: {
    Token: {
      address: '0x30E4DED8d92dee862E7951992A24b5d982B97ef0',
      abi: TokenABI,
    },
    IsableTorronNFT: {
      address: "0x594fB102b99058FC63765Eadfa42170db4eca6C0",
      abi: IsableTorronNFTABI,
    },
    IsableTorronMarket: {
      address: "0xF9Fa4A31A8f208fE8E98B5AABfF8e150a23eB7F0",
      abi: IsableTorronMarketABI
    }
  },  
}



export function getContractInfo(name, chainId = null) {
  if(!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId];  
  if(contracts) {
    return contracts?.[name];
  }else{
    return null;
  }
}

export function getContractObj(name, chainId, provider) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(info.address, info.abi, provider);
}

export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export function formatNum(value) {
  let intValue = Math.floor(value)
  if (intValue < 10) {
    return ''+ parseFloat(value).toFixed(2)
  } else if (intValue < 1000){
    return '' + intValue
  } else if (intValue < 1000000) {
    return parseFloat(intValue/1000).toFixed(1) + 'K'
  } else if (intValue < 1000000000) {
    return parseFloat(intValue/1000000).toFixed(1) + 'M'
  } else {
    return parseFloat(intValue/1000000000).toFixed(1) + 'G'
  }
}
