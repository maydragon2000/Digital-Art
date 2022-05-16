import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import FooterLogo from '../../assets/images/footerLogo.png';

// social icons images

const SiteFooter = styled.div`
    padding: 80px 0 0;
    background-color: var(--primaryColor);
    color: #F5F5F5;
    @media(max-width:767px){
        padding: 50px 0 0;
    }
    .container{
        .footer-Wrap{
            .topBox{
               .footerSubscribe{
                   .inputField{
                       .inputGroup{
                            display: flex;
                            input{
                                outline: none;
                                border: none;
                            }
                            button{
                                outline: none;
                                border: none;
                            }                            
                       }
                   }
                   .inputField:last-of-type{
                        margin-bottom: 0;
                    }
                    .inputGroup >*{
                        flex: 1;
                    }
               } 
            }
        }
    }
`

export class Footer extends Component {
    render() {
        return (
            <SiteFooter>
                <div className="container">
                    <div className="footer-Wrap">
                        <div className="row-wrap topBox">
                            <div className="box-12 box-lg-3 footerlogo">
                                <div className="inner-wrap">
                                    <a href="/">
                                        <img src={FooterLogo} alt="footerlogo" />
                                    </a>
                                </div>
                            </div>
                            <div className="box-12 box-lg-4 footerMenu">
                                <div className="inner-wrap">
                                    <div className="footerMenuLinks">
                                        <h4 className="footerHeading">Use ful Links</h4>
                                        <ul>
                                            <li><Link to="/explore">🎨 Art</Link></li>
                                            <li><Link to="/explore">🎵 Audio</Link></li>
                                            <li><Link to="/explore">🎥 Video</Link></li>
                                            <li><Link to="/home">Home</Link></li>
                                            <li><Link to="/explore">Explore</Link></li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottomBox">
                            <div className="copyTxet">
                                ©2021 Isable Torron, All Rights Reserved
                            </div>
                        </div>
                    </div>
                </div>
            </SiteFooter>
        );
    }
}


