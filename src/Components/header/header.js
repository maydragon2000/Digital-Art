import React, {useState} from 'react';
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import headerLogoImage from '../../assets/images/TRF-header-logo.png';
import headerUserIcon from '../../assets/images/header-user-icon-white.svg';
import walletIcon from '../../assets/images/wallet-icon-white.svg';

import { connectorLocalStorageKey, injectedConnector } from "../../utils/connectors"

const SiteHeader = styled.div`
    background-color: #a467df;
    padding: 10px 0;
    color: #fff;    
`


function Header(props) {
    const { connectAccount } = props;
    const {account, active, chainId, deactivate} = useWeb3React();

    const [showDropDown, setShowDropDown] = useState(false)
    const [openDrop, setOpenDrop] = useState(false)

    function signOut() {
        setShowDropDown(false); 
        deactivate(injectedConnector)     
        window.localStorage.setItem(connectorLocalStorageKey, "");
    }

    function connectWallet(){
        if (!account) {
            // connect account
            closeMenu(); 
            connectAccount();
        } else {
            // disconnect account
            closeMenu(); 
            signOut();
        }
    }
  

    function openMenu() {
        document.body.classList.add('menuOpen');
    };
    function closeMenu() {
        document.body.classList.remove('menuOpen');
    };

    
    return (
        <SiteHeader>
            <div className="container">
                <div className="headerWrap">
                    <div className="headerLogo">
                        <Link to="/home"><img src={headerLogoImage} alt="Isable Torron" /></Link>
                    </div>
                    <div className="menutriggerButton" onClick={(e) => openMenu()}>
                        <div className="menuTrigger">
                            <span className="line"></span>
                            <span className="line"></span>
                            <span className="line"></span>
                        </div>
                    </div>

                    <div className="headerMenu">
                        <span className="menuClose" onClick={(e) => closeMenu()}>X</span>
                        <ul>
                            <li onClick={(e) => closeMenu()}>
                                <Link className="menuLink" to="/home">Home</Link>
                            </li>
                            <li onClick={(e) => closeMenu()}>
                                <Link className="menuLink" to="/explore">Explore</Link>
                            </li>
                            <li style={{display: account? '':'none'}} onClick={(e) => closeMenu()}>
                                <Link className="menuLink" to="/activity">Activities</Link>
                            </li>
                            <li style={{display: account? '':'none'}} onClick={(e) => closeMenu()}>
                                <Link className="menuLink" to="/createitem">Create</Link>
                            </li>
                            <li style={{display: account? '':'none'}} onClick={(e) => closeMenu()}>
                                <Link to={`/profile/${account}`}><img src={headerUserIcon} alt="usericon" /></Link>
                            </li>  
                            <li onClick={() => { connectWallet()}}>
                                <div className={`cta-button ${account ? 'disconnect' : ''}`}> <img src={walletIcon} alt="Wallet" /> {account? 'Disconnect' : 'Connect Wallet'}</div>
                            </li>                              
                        </ul>
                    </div>
                </div>
            </div>
        </SiteHeader>
    );    
}

export default Header;


