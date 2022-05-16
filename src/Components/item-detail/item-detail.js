import React, {useState,useEffect} from "react";
import {useParams} from "react-router-dom"
import Slider from "react-slick";
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Querystring from 'query-string'
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from "react-modal";

import { getTokenBalance, listItem, delistItem, buy } from "../../utils/contracts";
import { formatNum } from "../../utils";


import Header from '../header/header';
import { Footer } from '../footer/footer'
import EventNode from './event-node';
import TokenIcon from '../../assets/images/token.png';
import ActivityIcon from '../../assets/images/activity-icon.svg';


const ProductDetaile = styled.div`
    padding: 100px 0 129px;
    background: rgba(112, 68, 155, 0.05);
    .media-box{
        .inner-wrap{
            width: 100%;
            max-width: 480px;
        }
        img{
            border-radius: 5px;
            filter: drop-shadow(0px 4px 20px rgba(112, 68, 155, 0.3));
            border-radius: 10px;
            width: 100%;
        }
        video{
            border-radius: 5px;
            filter: drop-shadow(0px 4px 20px rgba(112, 68, 155, 0.3));
            border-radius: 10px;
            max-width: 100%;
        }
        audio{
            position: relative;
            bottom: 10px; 
            display: flex;
            width: 100%;
            height: 25px;
            border-radius: 8px;
            margin: auto;            
        }
        .timer-box{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 24px;
            padding: 15px 20px;
            background-color: #4C4D4F;
            box-shadow: 0px 3.82413px 19.1206px rgba(0, 0, 0, 0.15);
            border-radius: 9.56032px;
            >div{
                font-weight: 600;
                font-size: 28px;
                line-height: 42px;
                color: #F4F4F4;
                text-align: center;
                padding: 0 16px;
                @media(max-width:1400px){
                    font-size: 20px;
                    line-height: 28px;
                }
                span{
                    text-transform: uppercase;
                    font-weight: 500;
                    font-size: 24px;
                    line-height: 36px;
                    color: #F4F4F4;
                    display: block;
                    margin-bottom: 5px;
                    @media(max-width:1400px){
                        font-size: 18px;
                        line-height: 24px;
                    }
                    @media(max-width:1199px){
                        font-size: 16px;
                        line-height: 22px;
                    }
                }
            }
        }
    }
    .content-box{
        font-size: 24px;
        line-height: 36px;

        @media(max-width:1400px){
            font-size: 18px;
            line-height: 28px;
        }
        @media(max-width:1199px){
            font-size: 16px;
            line-height: 26px;
        }
        @media(max-width: 991px){
            padding-top: 40px;
            
        }
        .inner-wrap{
            padding-left: 50px;
            @media(max-width: 991px){
                padding-left: 0px;
            }
        }
        h1{
            font-weight: 500;
            font-size: 43.0215px;
            line-height: 65px;
            margin-top: 0;
        }
        p{
            font-weight: normal;
            font-size:24px;
            line-height: 1.5;
            @media(max-width:1400px){
                font-size: 18px;
            }
            @media(max-width:1199px){
                font-size: 16px;
            }
        }
        .createdBy{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: 40px 0 20px;
            .artist-box{
                display: flex;
                align-items: center;
                padding-left: 25px;
    
                img{
                    width: 36px;
                    border-radius: 50%;
                }
                .details{
                    padding-left: 17px;
                    span{
                        display: block;
                    }
                }
            }
        }
        .ownedBy{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: 20px 0 40px;
            .artist-box{
                display: flex;
                align-items: center;
                padding-left: 25px;
    
                img{
                    width: 36px;
                    border-radius: 50%;
                }
                .details{
                    padding-left: 17px;
                    span{
                        display: block;
                    }
                }
            }
        }
        .priceBox{
            margin: 26px -20px;
            display: flex;
            justify-content: space-between;
            @media(max-width:1199px){
                margin: 20px -20px;
            }
            span{
                padding: 0 20px;
            }
        }
        .sizeBox{
            margin: 26px 0;
            @media(max-width:1199px){
                margin: 20px 0;
            }
        }
        .button-box{
            margin-top: 44px;
            .cta-button{
                width: 100%;
                font-size: 25px;
                line-height: 35px;
                padding: 15px 32px;
                border-radius: 10px;
                border:2px solid var(--primaryColor);
                &:hover{
                    background-color: var(--primaryColor);
                    border-color: var(--primaryColor);
                    color: #fff;
                }
            }
            @media(max-width:1199px){
                margin-top: 30px;
                .cta-button{
                    font-size: 18px;
                    line-height: 25px;
                }
            }
        }
    }
`
const ItemActivity = styled.div`
    padding: 105px 0;
    background-color: #ffffff;
    @media(max-width:1440px){
        padding: 60px 0;
    }
    .tableMain{
        background: #FFFFFF;
        border: 2px solid #B7B7B7;
        border-radius: 5px;
        .headigBox{
            padding: 22px 35px;
            padding-right: 70px;
            position: relative;
            .heading{
                font-size: 24px;
                line-height: 36px;
            }
            .arrow-icon{
                position: absolute;
                top: 18px; 
                right: 25px;
                cursor: pointer;
                padding: 10px;
                transform: rotate(180deg);
            }
            &.is-open{
                .arrow-icon{
                    transform: rotate(0deg);
                    top: 22px; 
                }                
            }
        }
        
        .filterBox{
            padding: 5px;
            background-color: #FAF5FF;
            border-top: 2px solid #B7B7B7;
            border-bottom: 2px solid #B7B7B7;
            .selectWrap{
                position: relative;
                img{
                    position: absolute;
                    right:15px;
                    top: 20px;
                    transform: rotate(180deg);
                    width: 13px
                }
            }
            select{
                background: #FFFFFF;
                border: 2px solid #B7B7B7;
                box-sizing: border-box;
                border-radius: 5px;
                width: 100%;
                height: 50px;
                padding: 6px 12px;
                padding-right: 33px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                color: #825BA8;
                &:hover{
                    outline:none;
                }
                &::-ms-expand {
                    display: none;
                }
            }
        }
        .tableBox{
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            -ms-overflow-style: -ms-autohiding-scrollbar;
            table{
                width: 100%;
                max-width: 100%;
                // margin-bottom: 1rem;
                background-color: transparent;
                border-collapse: collapse;
                border-spacing: 0 !important;
                th,td{
                    padding: 13px 25px;
                    text-align:left;
                    border-top: 2px solid #B7B7B7;
                    @media(max-width:991px){
                        min-width: 130px;
                    }
                }
                thead{
                    th{
                        verticale-align: bottom;
                        padding: 10px 30px;
                        border: none;
                        color: var(--primaryColor);
                        font-weight: 500;
                        font-size: 18px;
                        min-width: 115px;
                        &.event{
                            min-width: 90px;
                        }
                        &.price{
                            min-width: 90px;
                        }
                    }  
                }
                tbody{
                    td{
                        padding: 20px 25px ;
                        background-color: #FAF5FF;
                        font-size: 16px;
                        &.event{
                            img{
                                margin-right: 5px;
                            }
                        }
                        &.price{
                            img{
                                margin-right: 5px;
                                margin-top: -5px ;
                                width: 25px;
                            }
                        }
                        &.from{
                            img{
                                margin-right: 5px;
                                margin-top: -4px ;
                                width: 25px;
                                border-radius: 20px;
                            }
                        }  
                        &.to{
                            img{
                                margin-right: 5px;
                                margin-top: -4px ;
                                width: 25px;
                                border-radius: 20px;
                            }
                        }                        
                        &.date{
                            color: var(--primaryColor);
                        }
                    }
                }
            }
        }
    }
`
const ModalBody = styled.div`
    padding: 8px 12px;
    .modalHeader{
        text-align: right;        
    }
    .modalTitle{
        margin-bottom: 30px;
        font-weight: bold;
        font-size: 24px;
        text-align: center;
    }
    .modalLable{
        font-size: 20px;
        color: grey;
    }
    .payAmount{
        display: flex;
        justify-content: center;
        margin: 8px 0;
        img{
            width: 24px;
            height: 24px;
            border-radius: 12px;
        }
        .price{
            margin-left: 8px;
            font-size: 20px;
            font-weight: bold;
        }
        .unit{
            margin-left: 4px;
            font-size: 20px;
            font-weight: bold;
        }
    }  
    .modalRow{
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
    }
    .modalPrice{
        font-weight: bold;
        font-size: 16px;
        color: #1E2026;
    } 
    .modalAction{
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        width: 100%;
        text-align: center;
    }
    .cancelButton{
        background-image: linear-gradient(rgb(219 219 219) 0%,rgb(184 184 184) 100%);
        padding: 16px 20px;
        margin-right: 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        width: 160px;
    }
    .submitButton{
        background-image: linear-gradient(rgb(249, 141, 107) 0%, rgb(235, 97, 55) 100%);
        padding: 16px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        width: 160px;
    }
    .field{
        margin: 40px 0; 
    }
    .label{
        font-size: 14px;
        margin-bottom: 4px;
        color: grey;
    }
    .inputContainer{
        display: flex;
        border-bottom: 1px solid rgb(234, 236, 239);
        align-items: center;
        input{
            flex-grow: 1;
            border: unset;
            font-size: 18px;
            padding: 8px;
            &:focus-visible{
                outline: unset;
            }
        }
        .inputUnit{
            font-size: 18px;
            font-weight: bold;
        }
    }
`


function ItemDetail(props) {
    const {tokenId} = useParams();   
    const [item, setItem] = useState(null)
    const { account, active, chainId, library } = useWeb3React();
    const [balance, setBalance] = useState(0)
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)

    useEffect(() => {
        if(!!account && !!library) {
            getTokenBalance(account, chainId, library.getSigner())
            .then((balance) => {
              setBalance(balance)
            })
            .catch(() => {
              setBalance(0)
            })          
        }
        return () => {
          setBalance(0)          
        }
    }, [account, chainId, library])

    const [showUnlistMarketPlace, setShowUnlistMarketPlace] = useState(false)
    const [showPutMarketPlace, setShowPutMarketPlace] = useState(false)
    const [showBuyNowModal, setShowBuyNowModal] = useState(false)
    const [listingStatus, setListingStatus] = useState(false);
    const [delistingStatus, setDelistingStatus] = useState(false);
    const [buyingStatus, setBuyingStatus] = useState(false);
    const [putPrice, setPutPrice] = useState(0)

    function fetchItem(){
        axios.get(`/api/item/detail/${tokenId}`)
        .then(res => {
          setItem(res.data.item)             
        })
        .catch(err => {
          //show an error page that the item doesnt exist
          setItem(undefined)          
        })
    }
    useEffect(() => {
        if(!item) {
            fetchItem();
        }
    }, [item])

    const handleCloseDialog = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    function putFixed(){
        if (putPrice <= 0){
            setSnackBarMessage("Please input price correctly!")
            setOpenSnackbar(true)
            return
        } 
        setListingStatus(true)

        listItem(
            account,
            item.tokenId,
            putPrice,
            chainId,
            library.getSigner()
        ).then((tokenId) => {
            if (tokenId) {
                axios.get(`/api/sync_block`)
                .then((res) => {
                    setListingStatus(false);
                    setShowPutMarketPlace(false)
                    setSnackBarMessage("Listed Success! Data will be updated after some block confirmation!");
                    setOpenSnackbar(true);                    
                    props.history.push(`/profile/${account}`)                    
                    return true;
                })
                .catch((error) => {
                    if (error.response) {
                        setListingStatus(false);
                        setSnackBarMessage(error.response.data.message);
                        setOpenSnackbar(true);                        
                    }
                });
            } else {
                setListingStatus(false);
                setSnackBarMessage("Failed Transaction");                
                setOpenSnackbar(true);
            }
        });
        
    }    
    function unlistItem() {         
        setDelistingStatus(true)

        delistItem(
            item.pairId,
            chainId,
            library.getSigner()
        ).then((result) => {
            if (result) {
                axios.get(`/api/sync_block`)
                .then((res) => {
                    setDelistingStatus(false);
                    setShowUnlistMarketPlace(false)
                    setSnackBarMessage("Unlisted Success! Data will be updated after some block confirmation!");
                    setOpenSnackbar(true);                    
                    props.history.push(`/profile/${account}`)                    
                    return true;
                })
                .catch((error) => {
                    if (error.response) {
                        setDelistingStatus(false);
                        setSnackBarMessage(error.response.data.message);
                        setOpenSnackbar(true);                        
                    }
                });
            } else {
                setDelistingStatus(false);
                setSnackBarMessage("Failed Transaction");                
                setOpenSnackbar(true);
            }
        });

        
    }
    function buyItem() {
        if (balance < item.price){
            setShowBuyNowModal(false)
            setSnackBarMessage("Your available balance is less than the price!")
            setOpenSnackbar(true)            
            return
        } 
        setBuyingStatus(true)

        buy(
            account,
            item.pairId,
            item.price,
            chainId,
            library.getSigner()
        ).then((tokenId) => {
            if (tokenId) {
                axios.get(`/api/sync_block`)
                .then((res) => {
                    setBuyingStatus(false);
                    setShowBuyNowModal(false)
                    setSnackBarMessage("Bought Success! Data will be updated after some block confirmation!");
                    setOpenSnackbar(true);                    
                    props.history.push(`/profile/${account}`)                    
                    return true;
                })
                .catch((error) => {
                    if (error.response) {
                        setBuyingStatus(false);
                        setSnackBarMessage(error.response.data.message);
                        setOpenSnackbar(true);                        
                    }
                });
            } else {
                setBuyingStatus(false);
                setSnackBarMessage("Failed Transaction");                
                setOpenSnackbar(true);
            }
        });        
    }
    
    
    return (        
        <div className="pg-inner">
            <Header {...props}/>

            <ProductDetaile>
                <div className="container">
                    <div className="row-wrap">
                        <div className="box-12 box-lg-6 box-xl-5 media-box"> 
                            <div className="inner-wrap">
                                <div className="img-box">
                                {
                                    item?.assetType === 'video' ? <video src={item?.mainData} autoPlay loop controls/> 
                                        : item?.assetType === 'image' ? <img src={item?.mainData} alt="IteeImage"/>
                                            : <><img src={item?.coverImage} style={{width:'100%'}} alt="CoverImage"/><audio src={item?.mainData}  autoPlay loop controls/></>              
                                }                                     
                                </div>                                
                            </div>
                        </div>
                        <div className="box-12 box-lg-6 box-xl-7 content-box"> 
                            <div className="inner-wrap">
                                <h1>{item?.name}</h1>
                                <p>{item?.description}</p>
                                <div className="createdBy">
                                    <span>Created by:</span>
                                    <div className="artist-box">
                                        <img src={item?.creatorUser?.profilePic} alt="ArtistImage" 
                                            onClick={() => props.history.push(`/profile/${item?.creatorUser?.address}`)}/>
                                        <div className="details">
                                            <span className="artistName">{item?.creatorUser?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ownedBy">
                                    <span>Owned by:</span>
                                    <div className="artist-box">
                                        <img src={item?.ownerUser?.profilePic} alt="ArtistImage" 
                                            onClick={() => props.history.push(`/profile/${item?.ownerUser?.address}`)}/>
                                        <div className="details">
                                            <span className="artistName">{item?.ownerUser?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="priceBox"> 
                                    <span className="currentPrice">{item?.price> 0 ? 'Current Price':'Not for sale'}</span>
                                    <span className="price">{item?.price> 0 ? `${formatNum(item?.price)} ${process.env.REACT_APP_TOKEN}`:''}</span>                                    
                                </div>
                                <div className="button-box"> 
                                {
                                    item && account &&                                        
                                    (item.ownerUser.address.toLowerCase() === account.toLowerCase() ? 
                                        item?.price === 0 ? 
                                            <div className="cta-button cta-outline" 
                                                onClick={() => setShowPutMarketPlace(true)}>
                                                Put on the sale
                                            </div>
                                            :
                                            <div className="cta-button cta-outline" 
                                                onClick={() => setShowUnlistMarketPlace(true)}>
                                                Unlist from the sale
                                            </div>       
                                        :                                                 
                                        <div className="cta-button cta-outline"  style = {{display: item?.price > 0 ? "" : "none"}} onClick={() => setShowBuyNowModal(true)}>Buy Now</div>                                            
                                    )
                                }                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ProductDetaile>

            <ItemActivity>
                <div className="container">
                    <div className="row-wrap">
                        <div className="box-12 tableMain">
                            <div className="headigBox is-open" id="activityOpen" >
                                <span className="heading"><img src={ActivityIcon} alt="Activity" /> Item Activity</span>                                
                            </div>
                            <div className="filterBox">                                    
                            </div>
                            <div className="tableBox">
                                <table class="table">
                                    <thead class="thead-light">
                                        <tr>
                                            <th class="event" scope="col">Event</th>
                                            <th class="price" scope="col">Price</th>
                                            <th class="from" scope="col">From</th>
                                            <th class="to" scope="col">To</th>
                                            <th class="date" scope="col">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        item?.events.map((event, index)=> 
                                        <EventNode {...props} event={event}/>)  
                                    }                                            
                                    </tbody>
                                </table>
                            </div>                            
                            
                        </div>
                    </div>
                </div>
            </ItemActivity>            
            <Footer />

            <Modal
                isOpen={showBuyNowModal}
                onRequestClose={() => setShowBuyNowModal(false)}
                ariaHideApp={false}
                style={{
                    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 37, 53, 0.25)', zIndex: 99 },
                    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999 },
                }}
            >
                <ModalBody>
                    <div className="modalHeader">
                        <CloseIcon fontSize="small" onClick={() => setShowBuyNowModal(false)}/>                        
                    </div>
                    <div className="modalTitle">
                        <div className="modalLable">You will pay</div>
                        <div className="payAmount">
                            <img src={TokenIcon} alt="tokenIcon"/>
                            <div className="price">{formatNum(item?.price)}</div>
                            <div className="unit">{process.env.REACT_APP_TOKEN}</div>
                        </div>                                         
                    </div>           
                    <div className="modalRow"> 
                        <div className="modalLable">Available</div>
                        <div className="modalPrice">{formatNum(balance)} {process.env.REACT_APP_TOKEN}</div>
                    </div>
                   <div className="modalAction">
                        <div className="cancelButton" onClick={() => setShowBuyNowModal(false)}>Cancel</div>
                        <div className="submitButton" onClick={() => buyItem()}>
                        {
                            buyingStatus? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/> : "Confirm"
                        }                            
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                isOpen={showPutMarketPlace}
                onRequestClose={() => setShowPutMarketPlace(false)}
                ariaHideApp={false}
                style={{
                    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 37, 53, 0.25)', zIndex: 99, },
                    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999 },
                }}
            >
                <ModalBody>
                    <div className="modalHeader">
                        <CloseIcon fontSize="small" onClick={() => setShowPutMarketPlace(false)}/>                        
                    </div>
                    <div className="modalTitle">Put on Marketplace</div>
                    <div className="field">
                        <div className="label">Price</div>
                        <div className="inputContainer">
                            <input type={"number"} placeholder={"Enter Price"} value={putPrice} onChange={event => setPutPrice(event.target.value)} />
                            <div className="inputUnit">{process.env.REACT_APP_TOKEN}</div>
                        </div>
                    </div>                    

                   <div className="modalAction">
                        <div className="cancelButton" onClick={() => setShowPutMarketPlace(false)}>Cancel</div>
                        <div className="submitButton" onClick={() => putFixed()}>
                        {
                            listingStatus ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/> : "Confirm"
                        }
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={showUnlistMarketPlace}
                onRequestClose={() => setShowUnlistMarketPlace(false)}
                ariaHideApp={false}
                style={{
                    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 37, 53, 0.25)', zIndex: 99, },
                    content: {
                        top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999 },
                }}
            >
                <ModalBody>
                    <div className="modalHeader">
                        <CloseIcon fontSize="small" onClick={() => setShowUnlistMarketPlace(false)}/>                        
                    </div>
                    <div className="modalTitle">
                        Unlist Item                        
                        <div className="payAmount">
                            <div className="price">Are you sure you want to unlist this auction ?</div>                            
                        </div>                        
                    </div>                    
                   <div className="modalAction">
                        <div className="cancelButton" onClick={() => setShowUnlistMarketPlace(false)}>Cancel</div>
                        <div className="submitButton" onClick={() => unlistItem() }>
                        {
                            delistingStatus ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/> : "Unlist"
                        }
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            
            

            <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center' 
                }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseDialog}
                message={snackBarMessage}
                action={
                    <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseDialog}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    </React.Fragment>
                }
            />

        </div>
    );
   
}

export default ItemDetail;

