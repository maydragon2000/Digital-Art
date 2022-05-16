import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {PlayCircleOutline} from "@styled-icons/material";
import {Image} from "@styled-icons/material/Image";
import {MusicNote} from "@styled-icons/material/MusicNote";

import { formatNum } from "../../utils";

// musicList images

function Nft(props) {
   const {item} = props;
   return (
      <div className="item-box">
         <div className="card has-media">
            <Link to={`/details/${item?.tokenId}`}>
               <div className="img-box">
                  <img src={item?.coverImage} alt="ItemIamge" />
                  <div className="img-type">
                  {
                     item?.assetType === 'video' ? <PlayCircleOutline color={'white'} size={16}/>
                     : item?.assetType === 'audio' ? <MusicNote color={'white'} size={16}/>
                         : <Image color={'white'} size={16}/>
                  }
                  </div>
               </div>            
            </Link>
                  
            <div className="content-box">
               <h4>{item?.name}</h4>
               <div className="artist-box">
                  <Link to={`/profile/${item?.creatorUser?.address}`}>
                     <img src={item?.creatorUser?.profilePic} alt="ArtistImage" />
                  </Link>                         
                  <div className="details">
                     <span className="artistName">{item?.creatorUser?.name}</span>
                  </div>
               </div>
               <div className="counter-box">
                  <span className="bnb">{item?.price > 0 ? formatNum(item?.price) : 'Not for sale'}</span>
                  <span className="counter">{item?.price > 0 ? process.env.REACT_APP_TOKEN : ''}</span>
               </div>
            </div>
         </div>         
      </div>
   );
}

export default Nft;


