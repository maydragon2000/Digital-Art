import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import { getImageIpfsHash } from "../../utils/ipfs";

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../header/header';
import { Footer } from '../footer/footer'
import styled from 'styled-components';

const EditProfileContent = styled.div`
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
                @media(max-width:991px){
                    max-width: 100%;
                }                
                .artist-box{
                    display: block;
                    text-align: center;
                    position: relative;
                    img{
                        width: 200px;
                        box-shadow: 0 0 0 7px var(--primaryColor), 0 0 0 8px rgba(255, 255, 255, 0.25);
                        margin-bottom: 30px;  
                        margin-top: 10px;                      
                    }
                    .artistName{
                        font-size: 20px;
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
                    color:gray;
                }
            }
            .button-box{
                margin-top: 13px;
            }
        }
    }
`
function EditProfile(props) {
    const { user, login } = props;
    const [userProfile, setUserProfile] = useState(undefined)
    const { account, library } = useWeb3React();
    const [updating, setUpdating] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [file, setFile] = useState(null)
    const [newName, setNewName] = useState("")
    const [newProfilePicSrc, setNewProfilePicSrc] = useState("")
    const [imgUploading, setImgUploading] = useState(false)

    useEffect(() => {
        console.log(`user : ${user}`)
        if (!!user) {
            login();
        }
    }, [user, account, library, login])

    function updateProfile() {
        setUpdating(true)
        const data = new FormData()
        data.append("address", account)
        data.append("name", newName || "NoName")
        data.append("profilePic", newProfilePicSrc || "")

        axios.post("/api/user/update", data)
            .then(res => {
                setUpdating(false)
                setSnackBarMessage("Success")
                setOpenSnackbar(true)
                props.history.push(`/profile/${account}`)
            })
            .catch(err => {
                setUpdating(false)
                setSnackBarMessage(err.response.data.message)
                setOpenSnackbar(true)
            })
    }

    useEffect(() => {
        if (account && !userProfile) {
            getUser()
        }
    }, [user])

    function getUser() {
        axios.get(`/api/user/detail/${account}`)
            .then(res => {
                setUserProfile(res.data.user)
                setNewProfilePicSrc(res.data.user.profilePic)
                setNewName(res.data.user.name)
            })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    function handleFile(event) {
        const fileType = event.target.files[0].type.split("/")[0]
        if (fileType === "image") {
            const reader = new FileReader();
            setFile(event.target.files[0])
            reader.readAsArrayBuffer(event.target.files[0])
            setImgUploading(true)
            reader.onload = function (event) {
                const buffer = Buffer.from(reader.result);
                getImageIpfsHash(buffer).then((hash) => {
                    setNewProfilePicSrc(`https://ipfs.io/ipfs/${hash}`)
                    setImgUploading(false)
                })
            };
        }
    }

    return (
        <div className="pg-createItem">
            <Header {...props} />

            <EditProfileContent>
                {
                    account ?
                        <div className="container">
                            <div className="sectionHeading">
                                <h2>Edit Profile</h2>
                            </div>
                            <div className="row-wrap">
                                <div className="box-12 box-lg-5  box-xl-6 cardWrap">
                                    <div className="inner-wrap">
                                        <div className="card has-media followCard">
                                            <div className="content-box">
                                                <div className="artist-box">
                                                    <img src={newProfilePicSrc ? newProfilePicSrc : "https://ipfs.io/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67"} alt="Logo" className="circle-img" />
                                                    <div className="details">
                                                        <span className="artistName">{newName}</span>
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
                                                    <input type="file" accept="image/*" multiple={false} onChange={handleFile} className="fm-input" />
                                                    <p>{file && !imgUploading ? "Uploaded!" : imgUploading ? "Uploading to IPFS..." : ""} </p>
                                                </div>
                                                <div className="inputField">
                                                    <input type="text" onChange={e => setNewName(e.target.value)} value={newName} className="fm-input" placeholder="User Name" />
                                                </div>

                                                <div className="inputField button-box">
                                                    <button className="cta-button" disabled={updating} onClick={() => updateProfile()}>
                                                        {
                                                            updating ?
                                                                <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />
                                                                :
                                                                'Update'
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                        :
                        <></>
                }
            </EditProfileContent>
            <Footer />
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleClose}
                message={snackBarMessage}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}

export default EditProfile;

