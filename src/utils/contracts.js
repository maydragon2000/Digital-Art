import { BigNumber, ethers } from "ethers";
import { getContractInfo, getContractObj } from ".";

export function isAddress(address) {
    try {
        ethers.utils.getAddress(address);
    } catch (e) { return false; }
    return true;
}

export function toEth(amount) {
  return ethers.utils.formatEther(String(amount), {commify: true});
}

export function toWei(amount) {
  return ethers.utils.parseEther(String(amount));
}

/**
 * Governance Token Contract Management
 */
export async function getTokenBalance(account, chainId, provider) {
    const Token = getContractObj('Token', chainId, provider);
    if(Token) {
        const balance = await Token.balanceOf(account);
        return toEth(balance);
    }
    return 0;
}

export async function isTokenApprovedForMarket(account, amount, chainId, provider) {
    const marketContract = getContractObj('IsableTorronMarket', chainId, provider);
    const tokenContract = getContractObj('Token', chainId, provider);

    const allowance = await tokenContract.allowance(account, marketContract.address);
    if(BigNumber.from(toWei(amount)).gt(allowance)) {
        return false;
    }
    return true;
}

export async function approveTokenForMarket(chainId, signer) {
    const marketContract = getContractObj('IsableTorronMarket', chainId, signer);
    const tokenContract = getContractObj('Token', chainId, signer);

    const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
    try {
        const approve_tx = await tokenContract.approve(marketContract.address, approveAmount);
        await approve_tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
        return false;
    }
}


/**
 * NFT Contract Management
 */
export async function isNFTApprovedForMarket(account, chainId, provider) {
    const marketContract = getContractObj('IsableTorronMarket', chainId, provider);
    const nftToken = getContractObj('IsableTorronNFT', chainId, provider);

    return await nftToken.isApprovedForAll(account, marketContract.address);
}

export async function setNFTApprovalForMarket(approved, chainId, provider) {
    const marketContract = getContractObj('IsableTorronMarket', chainId, provider);
    const nftToken = getContractObj('IsableTorronNFT', chainId, provider);
    try {
        const tx = await nftToken.setApprovalForAll(marketContract.address, approved);
        await tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
    }
    return false;
}


export async function addItem(uri, royalty, chainId, provider) {
    const nftToken = getContractObj('IsableTorronNFT', chainId, provider);
    const nftTokenInfo = getContractInfo('IsableTorronNFT', chainId);   
    try {
        const tx = await nftToken.addItem(uri,royalty)
        const receipt = await tx.wait(2);
        if(receipt.confirmations) {
            const interf = new ethers.utils.Interface(nftTokenInfo.abi);
            const logs = receipt.logs;
            let tokenId = 0;
            for(let index = 0; index < logs.length; index ++) {
              const log = logs[index];
              if(nftTokenInfo.address.toLowerCase() === log.address.toLowerCase()) {
                tokenId = interf.parseLog(log).args.tokenId.toNumber();
                return tokenId;
              }
            }
        }
        return false;
    }catch(e) {
        console.log(e)
        return false;
    }        
}




/**
 * Market Contract Management
 */


export async function listItem(owner, token_id, price, chainId, provider) {
    const marketContract = getContractObj('IsableTorronMarket', chainId, provider);
    const marketContractInfo = getContractInfo('IsableTorronMarket', chainId);
    if (!marketContract || !marketContractInfo) return false
    try {
        let isApproved = await isNFTApprovedForMarket(owner, chainId, provider);
        if(!isApproved) {
            isApproved = await setNFTApprovalForMarket(true, chainId, provider);            
        }
        if (isApproved) {
            const tx =  await marketContract.list(token_id, ethers.utils.parseEther(price));
            const receipt = await tx.wait(2);
            if(receipt.confirmations) {
                const interf = new ethers.utils.Interface(marketContractInfo.abi);
                const logs = receipt.logs;
                let pairId  = 0;
                for(let index = 0; index < logs.length; index ++) {
                    const log = logs[index];
                    if(marketContractInfo.address.toLowerCase() === log.address.toLowerCase()) {
                        pairId = interf.parseLog(log).args.id.toString();
                        return pairId;
                    }
                }
            }
        }               
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

export async function delistItem(id, chainId, provider) {
    const marketContract = getContractObj('IsableTorronMarket', chainId, provider);
    if (!marketContract) return false
    try {
      const tx = await marketContract.delist(id)
      await tx.wait(2)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
}
  
export async function buy(account, id, price, chainId, provider) {
    const marketContract = getContractObj('IsableTorronMarket', chainId, provider)
    const Token = getContractObj('Token', chainId, provider)
    if (!marketContract || !Token) return false    
    try {
        let isTokenApproved = await isTokenApprovedForMarket(account, price, chainId, provider)
        if (!isTokenApproved) {
            isTokenApproved = await approveTokenForMarket(chainId, provider)
        }
        if (isTokenApproved) {
            const tx = await marketContract.buy(id)
            await tx.wait(2)
            return true
        }
        return false          
    } catch (e) {
      console.log(e)
      return false
    }
}