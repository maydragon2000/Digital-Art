import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { useParams } from "react-router-dom"


import Header from '../header/header';
import { Footer } from '../footer/footer'
import styled from 'styled-components';

import Nft from '../home/nft';

const ProfileContent = styled.div`
    padding: 50px 0 76px;
    @media(max-width:767px){
        padding: 40px 0 50px;
    }
    .edit-button{
        line-height: 30px;
        border: 1px solid #B4B4B4;
        border-radius: 52px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 90px;
        height: 40px;
        cursor: pointer;
        background-color: var(--primaryColor);
        color: #fff;
        border-color: var(--primaryColor);
        margin-right: 40px;
    }
    .user-info{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 20px;
        img{
            width: 100px;
            height:100px;
            border-radius: 50%;
            margin-bottom: 10px;
            box-shadow: 0 0 0 2px gray;
        }
    }
    .filter-box{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -10px;
        justify-content: center;
        .sectionHeading{
            font-weight: normal;
            padding: 0 10px;
            margin-right: 40px;
           
        }
        form{
            padding: 0 10px;
            @media(max-width:767px){
                width: 100%;
                padding: 0;
                margin-top: 20px;
            }
            .inputGroup{
                background-color: #fff;
                border: 1px solid #B4B4B4;
                border-radius: 52px;
                overflow :hidden;
                max-width:280px;
                display:grid;
                grid-template-columns: 80% 20%;
                .fm-input{
                    padding: 8px 25px;
                    font-size: 20px;
                    height: 54px;
                    @media(max-width:1440px){
                        font-size: 16px;
                        padding: 5px 25px;
                        height: 45px;
                    }
                    @media(max-width:767px){
                        height: 35px;
                    }
                }
                .search-button{
                    background: transparent ;
                    cursor: pointer;
                }
            }
        }
        .filterLinks{
            padding: 0;
            margin: 0;
            display: flex;
            list-style: none;
            border-bottom: 3px solid rgba(112, 68, 155, 0.25);
            li{
                padding: 0 10px;
                &:first-child{
                    padding-left: 0;
                }
                &:last-child{
                    padding-right: 0;
                }
            }
            div{
                font-weight: 600;
                font-size: 24px;
                line-height: 36px;
                padding: 10px 20px;
                color: #000;
                margin-bottom: -3px;
                display: inline-block;
                transition: all .6s;
                cursor: pointer;
                &.active{
                    color: var(--primaryColor);
                    border-bottom: 3px solid var(--primaryColor);

                }
                &:not(.active):hover{
                    opacity: .7;
                }
            }
        }
    }
    .exploreList{
        margin-top: 40px;
        @media(max-width:767px){
            margin-top: 20px;
        }
        .row-wrap{
            margin: 0 -10px;
            justify-content: center;
            .item-box{
                margin-top: 20px;
                padding: 0 10px;
            }
        }
    }
`
function Profile(props) {

    const [items, setItems] = useState([])
    const { user, login } = props;
    let { address } = useParams();
    const [curTab, setCurTab] = useState('sale')
    //backend
    // const { account, active, chainId, library } = useWeb3React();
    const { account, library } = useWeb3React();

    const [userProfile, setUserProfile] = useState(undefined)

    useEffect(() => {
        if (!userProfile) {
            getUser()
        }
    }, [address, getUser, userProfile])

    useEffect(() => {
        if (!!user) {
            login();
        }
    }, [user, account, library, login])

    function getUser() {
        axios.get(`/api/user/detail/${address ? address : ""}`)
            .then(res => {
                setUserProfile(res.data.user)
            })
    }

    useEffect(() => {
        if (address) {
            let query = `/api/item/?owner=${address}`;
            switch (curTab) {
                case 'sale':
                    // On Sale
                    query = `/api/item/?owner=${address}&sale=true`;
                    break;
                case 'owned':
                    // Owned
                    query = `/api/item/?owner=${address}`;
                    break;
                case 'created':
                    // Created
                    query = `/api/item/?creator=${address}`;
                    break;
                default:
                    break;
            }
            axios.get(query)
                .then(res => {
                    setItems(res.data.items)
                }).catch(err => {
                    setItems([])
                    console.log(err)
                })
        }
    }, [curTab, address])

    return (
        <div className="pg-explore">
            <Header {...props} />
            <ProfileContent>
                <div style={{ textAlign: 'right' }}>
                    <div className="edit-button" onClick={() => props.history.push('/editprofile')}>Edit</div>
                </div>
                <div className="user-info">
                    <img src={userProfile && userProfile.profilePic ? userProfile.profilePic : "https://ipfs.io/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"} alt="ArtistImage" />
                    <span className="artistName">{userProfile && userProfile.name ? userProfile.name : "NoName"}</span>
                </div>
                <div className="container">
                    <div className="filter-box">
                        <ul className="filterLinks">
                            <li onClick={() => setCurTab('sale')}><div className={curTab === 'sale' ? 'active' : ''}>On sale</div></li>
                            <li onClick={() => setCurTab('owned')}><div className={curTab === 'owned' ? 'active' : ''}>Owned</div></li>
                            <li onClick={() => setCurTab('created')}><div className={curTab === 'created' ? 'active' : ''}>Created</div></li>
                        </ul>
                    </div>
                    <div className="exploreList">
                        <div className="row-wrap">
                            {
                                items.map((item, index) => <div className="box-12 box-md-6 box-lg-4 box-xl-3">
                                    <Nft key={index} {...props} item={item} />
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            </ProfileContent>

            <Footer />
        </div>
    );

}

export default Profile;

