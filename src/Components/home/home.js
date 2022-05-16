import React, {useState,useEffect} from "react";
import axios from 'axios'
import Header from '../header/header';
import { Footer } from '../footer/footer'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Slider from "react-slick";

// header and banner images
import banner from '../../assets/images/home-banner-img.jpg'
import exploreIcon from '../../assets/images/explore-icon-white.svg';
import joinDiscard from '../../assets/images/joindiscard-icon-white.svg';

// EvesGarden images
import GardenWalletImage from '../../assets/images/Setupyourwallet.svg';
import GardenWalletImage2 from '../../assets/images/Createyourcollection.svg';
import GardenWalletImage3 from '../../assets/images/AddyourNFTs.svg';
import GardenWalletImage4 from '../../assets/images/Listthemforsale.svg';

import Nft from './nft';

const HeroBanner = styled.div`
   padding: 100px 0;
   background-color: #333;
   position: relative;
   @media(max-width:1200px){
      padding: 80px 0;
   }   
   
`

const AudioList = styled.div`
   padding: 20px 0;
   @media(max-width:1440px){
      padding: 20px 0 20px;
   }
   @media(max-width:767px){
      padding: 20px 0 20px;
   }
`

const Art = styled.div`
   padding: 20px 0;
   @media(max-width:1440px){
      padding: 20px 0 20px;
   }
   @media(max-width:767px){
      padding: 20px 0 20px;
   }
`

const VideoList = styled.div`
   padding: 20px 0;
   @media(max-width:1440px){
      padding: 20px 0 20px;
   }
   @media(max-width:767px){
      padding: 20px 0 20px;
   }
`

const EvesGarden = styled.div`
   padding: 80px 0;
   @media(max-width:1440px){
      padding: 60px 0 80px;
   }
   @media(max-width:767px){
      padding: 40px 0 60px;
   }
`

// slider setting
var settings = {
   dots: true,
   infinite: false,
   speed: 1000,
   slidesToShow: 4,
   slidesToScroll: 1,
   initialSlide: 0,
   responsive: [
      {
         breakpoint: 1200,
         settings: {
         slidesToShow: 3,
         slidesToScroll: 3,
         infinite: true,
         dots: true
         }
      },
      {
         breakpoint: 991,
         settings: {
         slidesToShow: 2,
         slidesToScroll: 2,
         initialSlide: 2
         }
      },
      {
         breakpoint: 575,
         settings: {
         slidesToShow: 1,
         slidesToScroll: 1
         }
      }
   ]
};

function Home(props) {

   const [artItems, setArtItems] = useState([]) 
   const [audioItems, setAudioItems] = useState([]) 
   const [videoItems, setVideoItems] = useState([]) 
   
   useEffect(() => {
      let query = `/api/item/?assetType=image&sale=true&limit=8`;          
      axios.get(query)
      .then(res => {                
         setArtItems(res.data.items)                
      }).catch(err => {
         setArtItems([])                
            console.log(err)
      })          
   }, [props])
   useEffect(() => {      
      let query = `/api/item/?assetType=audio&sale=true&limit=8`;          
      axios.get(query)
      .then(res => {                
         setAudioItems(res.data.items)                
      }).catch(err => {
         setAudioItems([])                
            console.log(err)
      })         
   }, [props])
   useEffect(() => {
      let query = `/api/item/?assetType=video&sale=true&limit=8`;          
      axios.get(query)
      .then(res => {                
         setVideoItems(res.data.items)                
      }).catch(err => {
         setVideoItems([])                
            console.log(err)
      })          
   }, [props])
   return (
      <div>
         <Header {...props}/>
         <HeroBanner>
            <div className="bannerWrap">
               <div className="bgBox">
                     <img src={banner} alt="Flowers"></img>
                  </div>
                  <div className="container">
                     <div className="BannerContent">
                           <h1>Discover Digital Artwork and Collect NFTs</h1>
                           <div className="subHeading">Subscribe for more hot and exclusive things</div>
                           <div className="buttonBox">
                              <Link to="/explore"><img src={exploreIcon} alt="Explore"/> Explore</Link>                              
                           </div>
                     </div>
                  </div>
            </div>
         </HeroBanner>

         <Art>
            <div className="container">
               <div className="sectionHeading has-link">
                  <h2>🎨 Art</h2>
                  <Link to="/explore" className="cta-link cta-link-arrow">View All</Link>
               </div>
               <div className="musicList">
                  <Slider {...settings}>
                  {
                     artItems.map((item, index)=> <Nft key={index} {...props} item={item}/>)  
                  }
                  </Slider>
               </div>
            </div>
         </Art>


         <AudioList>
            <div className="container">
               <div className="sectionHeading has-link">
                  <h2>🎵 Audio</h2>
                  <Link to="/explore" className="cta-link cta-link-arrow">View All</Link>
               </div>
               <div className="musicList">
                  <Slider {...settings}>
                     {
                        audioItems.map((item, index)=> <Nft key={index} {...props} item={item}/>)  
                     }
                  </Slider>
               </div>
            </div>
         </AudioList>

         <VideoList>
            <div className="container">
               <div className="sectionHeading has-link">
                  <h2>🎥 Video</h2>
                  <Link to="/explore" className="cta-link cta-link-arrow">View All</Link>
               </div>
               <div className="musicList">
                  <Slider {...settings}>
                     {
                        videoItems.map((item, index)=> <Nft key={index} {...props} item={item}/>)  
                     }
                  </Slider>
               </div>
            </div>
         </VideoList>

         <EvesGarden>
            <div className="container">                  
               <div className="row-wrap evesGardenList">
                     
                     <div className="box-12 box-md-6 box-lg-4 box-xl-3 item-box">
                        <div className="mediaCard">
                           <div className="img-box">
                                 <img src={GardenWalletImage} alt="GardenWalletImage" />
                           </div>
                           <div className="content-box">
                                 <h3>Setup your wallet</h3>
                                 <p>Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the NFT Marketplace in the top right corner. Learn about the wallets we support.</p>
                           </div>
                        </div>
                     </div>

                     <div className="box-12 box-md-6 box-lg-4 box-xl-3 item-box">
                        <div className="mediaCard">
                           <div className="img-box">
                                 <img src={GardenWalletImage2} alt="GardenWalletImage" />
                           </div>
                           <div className="content-box">
                                 <h3>Create your collection</h3>
                                 <p>Click create and set up your collection.add social links,a description,profile & banner images, and set a secondary sales fee.</p>
                           </div>
                        </div>
                     </div>

                     <div className="box-12 box-md-6 box-lg-4 box-xl-3 item-box">
                        <div className="mediaCard">
                           <div className="img-box">
                                 <img src={GardenWalletImage3} alt="GardenWalletImage" />
                           </div>
                           <div className="content-box">
                                 <h3>Add your NFTs</h3>
                                 <p>upload your work(image,video,audio,or 3d art),add a title and description,and customize your NFTs with properties, stats, and unlockable content.</p>
                           </div>
                        </div>
                     </div>

                     <div className="box-12 box-md-6 box-lg-4 box-xl-3 item-box">
                        <div className="mediaCard">
                           <div className="img-box">
                                 <img src={GardenWalletImage4} alt="GardenWalletImage" />
                           </div>
                           <div className="content-box">
                                 <h3>List them for sale</h3>
                                 <p>choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs.</p>
                           </div>
                        </div>
                     </div>
               </div>
            </div>
         </EvesGarden>

         <Footer/>
      </div>
   );
}

export default Home;
