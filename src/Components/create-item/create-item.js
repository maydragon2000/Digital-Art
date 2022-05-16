import React, {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getImageIpfsHash } from "../../utils/ipfs";
import { addItem } from "../../utils/contracts";

import Header from '../header/header';
import {Footer} from '../footer/footer'
import BlankImg  from '../../assets/images/blank.png';


const CreateItemContent = styled.div`
    padding: 60px 0 190px;
    @media(max-width:1440px){
        padding: 40px 0 90px;
    }
    @media(max-width:767px){
        padding: 40px 0 70px;
    }
    .sectionHeading{
        h2{
            margin: 0;
            margin-bottom: 65px;
            @media(max-width:1440px){
                margin-bottom: 40px;
            }
            @media(max-width:767px){
                margin-bottom: 35px;
            }
        }
    }
    .cardWrap{
        .inner-wrap{
            .card{
                max-width: 423px;
                background: var(--primaryColor);
                padding-bottom: 40px;
                @media(max-width:991px){
                    max-width: 100%;
                }                
                .artist-box{
                    display: block;
                    text-align: center;
                    position: relative;
                    img{
                        width: 84px;
                        margin-top: -44px;
                        box-shadow: 0 0 0 7px var(--primaryColor), 0 0 0 8px rgba(255, 255, 255, 0.25);
                        margin-bottom: 30px;
                        @media(max-width:767px){
                            width: 60px;
                            margin-top: -30px; 
                            box-shadow: 0 0 0 4px var(--primaryColor),0 0 0 5px rgba(255,255,255,0.25);
                        }
                    }
                    .artistName{
                        font-size: 20px;
                    }
                    p{
                        font-size: 16px;
                        line-height: 24px;
                        font-weight: 600;
                        margin-top: 20px;
                    }
                    .cta-button{
                        width: 100%;
                        border: 2px solid rgba(255, 255, 255, 0.25);
                        border-radius: 25px;
                        color: #f0f0f0;
                        font-size: 16px;
                        @media(max-width:991px){
                            max-width: 350px;
                            margin: 0 auto;
                        }
                        &:hover{
                            background-color: #fff;
                            color:var(--primaryColor);
                        }
                    }
                }                
            }
        }
    }
    .formWrap{
        .inner-wrap{
            @media(max-width:1199px){
                padding-left: 30px;
            }
            @media(max-width:991px){
                padding-left: 0px;
                margin-top: 40px;
            }
        }
        .form-box{
            padding: 64px;
            background: #FFFFFF;
            box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            @media(max-width:1199px){
                padding: 47px 30px;
            }
            @media(max-width:767px){
                padding: 30px 20px;
                margin-bottom: 30px;
            }            
            .inputField{
                margin-bottom: 33px;
                &:last-of-type{
                    margin-bottom: 0;
                }
                @media(max-width:767px){
                    margin-bottom: 20px; 
                    &:last-of-type{
                        margin-bottom: 0;
                    }
                }
                p{
                    font-size: 14px;
                    line-height: 15px;
                }
                .uploadField{
                    margin: 20px 20px;
                    .option{
                        margin-top: 4px;
                        font-size : 14px;
                    }
                    .label{
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 12px;
                        span{
                            color: grey;
                            font-size: 14px;
                        }
                    }
                    .uploadContainer{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        border: dotted 1px grey;
                        border-radius: 12px;
                        height: 200px;
                        .uploadCaption{
                            font-size: 14px;
                            color: grey;    
                        }
                        .chooseFile{
                            display: inline-block;
                            position: relative;
                            padding: 10px 20px;
                            background: #b6d5ff;
                            border-radius: 20px;
                            margin-top: 20px;
                            color: #e24717;
                            font-size: 14px;
                            font-weight: bold;
                            input{
                                position: absolute;
                                top: 0;
                                left: 0;
                                bottom: 0;
                                right: 0;
                                opacity: 0;
                            }
                        }
                    }
                    .previewContainer{
                        display: flex;
                        flex-direction: column;
                        border: dotted 1px grey;
                        border-radius: 12px;
                        height: 200px;
                        .closeIcon{
                            width: 100%;
                            margin-left: -5px;
                            margin-top: 5px;
                            text-align: right;
                        }
                        .mediaContainer{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;    
                            height: 160px;
                            img{
                                border-radius: 6px;
                                max-width: 80%;
                                max-height: 100%;
                            }
                            audio{
                                border-radius: 6px;
                                max-width: 80%;
                                max-height: 100%;
                            }
                            video{
                                border-radius: 6px;
                                max-width: 80%;
                                max-height: 100%;
                            }
                        }
                    }
                }
            }
            .button-box{
                margin-top: 13px;
            }
        }
    }
`
function CreateItem(props) {
    
    const { account, active, chainId, library } = useWeb3React();
    const [userProfile, setUserProfile] = useState(undefined)

    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)

    const [mainFile, setMainFile] = useState(null)
    const [mainFileHash, setMainFileHash] = useState("");
    const [mainFileUploading, setMainFileUploading] = useState(false);
    const [showCoverUpload, setShowCoverUpload] = useState(false);
    
    const [coverImgFile, setCoverImgFile] = useState(null)
    const [coverImgHash, setCoverImgHash] = useState("");
    const [coverImageUploading, setCoverImageUploading] = useState(false);
    const [mediaType, setMediaType] = useState("");   
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [royalty, setRoyalty] = useState(10);
    const [creatingItem, setCreatingItem] = useState(false);

    const handleCloseDialog = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    useEffect(() => {        
        if (!userProfile && account){
          getUser()
        }        
    }, [account])

    function getUser(){
        axios.get(`/api/user/detail/${account ? account : ""}`)
        .then(res => {
          setUserProfile(res.data.user)                
        })
    }

    function onCreateItem() {  
        if (!name){
            setSnackBarMessage("Please Input Title!")
            setOpenSnackbar(true)
            return
        } 
        if (!description){
            setSnackBarMessage("Please Input Description!")
            setOpenSnackbar(true)
            return
        }
        if (royalty > 20 || royalty < 5){
            setSnackBarMessage("Please Input Royalty Correctly!")
            setOpenSnackbar(true)
            return
        }
        if (!mainFileHash){
            setSnackBarMessage("Please Upload file!")
            setOpenSnackbar(true)
            return
        }
        if ((mediaType === "video" || mediaType === "audio") && !coverImgHash){
            setSnackBarMessage("Please Upload cover image!")
            setOpenSnackbar(true)
            return
        }
        // call createItem contract function
        
        const openseadata = {
            assetType: mediaType,
            name: name,
            description: description,
            mainData: mainFileHash,
            coverImage: coverImgHash
        };
        setCreatingItem(true);    
        getImageIpfsHash(Buffer.from(JSON.stringify(openseadata))).then((hash) => {
            let tokenUri = `https://ipfs.io/ipfs/${hash}`;
            addItem(
                tokenUri,
                royalty ,
                chainId,
                library.getSigner()
            ).then((tokenId) => {
                if (tokenId) {
                    axios.get(`/api/sync_block`)
                    .then((res) => {
                        setSnackBarMessage("Minted Success! Data will be updated after some block confirmation!");
                        setOpenSnackbar(true);
                        props.history.push(`/profile/${account}`)
                        setCreatingItem(false);
                        return true;
                    })
                    .catch((error) => {
                        if (error.response) {
                            setSnackBarMessage(error.response.data.message);
                            setOpenSnackbar(true);
                            setCreatingItem(false);
                        }
                    });
                } else {
                    setSnackBarMessage("Failed Transaction");
                    setCreatingItem(false);
                    setOpenSnackbar(true);
                }
            });
        });
    }

    function handleMainFile(event) {  
        console.log("handleMainFile")      
        const fileType = event.target.files[0].type.split("/")[0]                
        if (fileType === "image") {
            setMediaType(fileType)
            setCoverImgFile(null)
            setCoverImgHash("")
            setShowCoverUpload(false)
            const reader = new FileReader();
            setMainFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setMainFileUploading(true)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setMainFileHash(`https://ipfs.io/ipfs/${hash}`)
                    setCoverImgHash(`https://ipfs.io/ipfs/${hash}`)
                    setMainFileUploading(false)
                    setCoverImageUploading(false)
                })
            };
        } else if ((fileType === "video") || (fileType === "audio") ) {            
            const reader = new FileReader();
            setMainFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setMainFileUploading(true)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setMainFileHash(`https://ipfs.io/ipfs/${hash}`)
                    setMainFileUploading(false)
                    setMediaType(fileType)
                    setShowCoverUpload(true)
                })
            };
        }        
    }
    function handleCoverImg(event) {        
        const fileType = event.target.files[0].type.split("/")[0]
        if (fileType === "image") {
            const reader = new FileReader();
            setCoverImgFile(event.target.files[0])       
            reader.readAsArrayBuffer(event.target.files[0])
            setCoverImageUploading(true)
            reader.onload = function(event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setCoverImgHash(`https://ipfs.io/ipfs/${hash}`)
                    setCoverImageUploading(false)
                })
            };
        }        
    }


    function closeMainFile(){
        setMainFile(null)
        setMainFileHash("")
        setMainFileUploading(false)
        setShowCoverUpload(false)

        setCoverImgFile(null)
        setCoverImgHash("")
        setCoverImageUploading(false)
        setMediaType("")
    }

    function closeCoverImg(){        
        setCoverImgFile(null)
        setCoverImgHash("")
        setCoverImageUploading(false)        
    }

    return (
        <div className="pg-createItem">
            <Header {...props}/>

            <CreateItemContent>
                <div className="container">
                    <div className="sectionHeading">
                        <h2>Create Item</h2>
                    </div>
                    <div className="row-wrap">
                        <div className="box-12 box-lg-5  box-xl-6 cardWrap">
                            <div className="inner-wrap">
                                <div className="card has-media followCard">
                                    <div className="img-box">
                                        <img src={coverImgHash ? coverImgHash: BlankImg} alt="CreateItemCradImg" />
                                    </div>
                                    <div className="content-box">
                                        <div className="artist-box">
                                        <img src={userProfile && userProfile.profilePic ? userProfile.profilePic : "https://ipfs.io/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"} className="circle-img" alt="logo" />
                                            <div className="details">
                                                <span className="artistName">{name}</span>
                                                <p>{description} </p>                                                    
                                            </div>
                                        </div>                                            
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="box-12 box-lg-7 box-xl-6 formWrap">
                            <div className="inner-wrap">
                                <div className="form-box">
                                    <div>
                                        <div className="inputField">                                           
                                        
                                            <div className="uploadField">
                                                <div className="label">Upload file</div>
                                                <div className="uploadContainer" style = {{display : mainFile? "none":""}}>
                                                    <div className="uploadCaption">PNG, GIF, WEBP, MP4 or MP3. Max 100mb</div>
                                                    <div className="chooseFile">
                                                        Choose File
                                                        <input type="file" value="" accept="image/*,audio/*,video/*" onChange={handleMainFile}/>
                                                    </div>
                                                </div>
                                                <div className="previewContainer" style = {{display : mainFile? "":"none"}}>                     
                                                    <div className="closeIcon" style = {{display : mainFileHash ? "":"none"}}>                          
                                                        <CloseIcon onClick={() => closeMainFile()} fontSize="small" />
                                                    </div>
                                                    <div className="mediaContainer">  
                                                        <CircularProgress style={{display : mainFileUploading ? "":"none", width: "30px", height: "30px", color: "red"}}/>                        
                                                        <img style = {{display : mainFileHash && mediaType === "image" ? "":"none"}} src={mainFileHash} alt="main"/>
                                                        <audio style = {{display : mainFileHash && mediaType === "audio" ? "":"none"}} src={mainFileHash} autoPlay loop controls/>  
                                                        <video style = {{display : mainFileHash && mediaType === "video" ? "":"none"}} src={mainFileHash} autoPlay loop controls/>
                                                    </div>                    
                                                </div>               
                                            </div>
                                            <div className="uploadField" style = {{display : showCoverUpload ? "":"none"}}>
                                                <div className="label">Upload cover</div>
                                                <div className="uploadContainer" style = {{display : coverImgFile? "none":""}}>
                                                    <div className="uploadCaption">JPG, PNG, GIF, WEBP. Max 100mb</div>
                                                    <div className="chooseFile">
                                                        Choose File
                                                        <input type="file" value="" accept="image/*" onChange={handleCoverImg}/>
                                                    </div>                    
                                                </div>
                                                <div className="previewContainer" style = {{display : coverImgFile? "":"none"}}>                     
                                                    <div className="closeIcon" style = {{display : coverImgHash ? "":"none"}}>                          
                                                        <CloseIcon onClick={() => closeCoverImg()} fontSize="small" />
                                                    </div>
                                                    <div className="mediaContainer">  
                                                        <CircularProgress style={{display : coverImageUploading ? "":"none", width: "30px", height: "30px", color: "red"}}/>                        
                                                        <img style = {{display : coverImgHash ? "":"none"}} src={coverImgHash} alt="cover"/>                        
                                                    </div>                    
                                                </div>
                                                <div className="option">Please add cover Image to your media file</div>
                                            </div> 

                                        </div> 

                                        <div className="inputField">
                                            <input value={name} type="text" className="fm-input" placeholder="Item Name" 
                                                onChange={event => setName(event.target.value)}
                                            />                                            
                                        </div>  
                                        <div className="inputField">
                                            <textarea value={description} type="text" className="fm-input" placeholder="Description" 
                                                onChange={event => setDescription(event.target.value)}
                                            />                                             
                                        </div>  
                                        <div className="inputField">
                                            <input value={royalty} type="number" className="fm-input" placeholder="Royality"
                                                onChange={event => setRoyalty(event.target.value)}
                                            />
                                            <p >Suggested: 10%, Minimum is 5%, Maximum is 20%</p>
                                        </div>                                                                                     

                                        <div className="inputField button-box"  >
                                            <button className="cta-button" disabled={creatingItem} onClick={() => onCreateItem()}> 
                                            {
                                                creatingItem ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/>:"Create item"
                                            }
                                            </button>
                                        </div>     
                                    </div>
                                </div>

                            </div>

                        </div>
                        
                    </div>
                </div>
            </CreateItemContent>

            <Footer/>
            <Snackbar
                anchorOrigin={{
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

export default CreateItem;

