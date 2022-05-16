import React, {useState,useEffect} from "react";
import axios from 'axios'
import Header from '../header/header';
import { Footer } from '../footer/footer'
import styled from 'styled-components';

// search icon
import SearchIcon from '../../assets/images/search-icon.svg';

import Nft from '../home/nft';

const ExploreContent = styled.div`
    padding: 60px 0 76px;
    @media(max-width:767px){
        padding: 40px 0 50px;
    }
    .filter-box{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -10px;
        .sectionHeading{
            font-weight: normal;
            padding: 0 10px;
            margin-right: 40px;
           
        }        
        .inputGroup{
            margin-top: 20px;
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
                outline: none;
                border: none;
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
                outline: none;
                border: none;
            }
        }        
        .filterLinks{
            list-style: none;
            padding: 0 10px;
            margin: 0;
            @media(max-width:1199px){
                padding: 0;
                margin-top: 30px;
            }
            @media(max-width:1199px){
                display: flex;
                flex-wrap : wrap;
                justify-conten: center;
            }
            @media(max-width:767px){
                margin-top: 20px;
            }
            li{
                display: inline-block;
            }
            div{
                font-size: 20px;
                line-height: 30px;
                padding: 8px 25px;
                border: 1px solid #B4B4B4;
                border-radius: 52px;
                color: #000;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                min-width: 108px;
                text-align: center;
                margin: 5px 12px;
                height: 54px;
                transition: all .3s ease;
                &:hover,
                &.active{
                    background-color:var(--primaryColor);
                    color: #fff;
                    border-color : var(--primaryColor);
                }
                @media(max-width:1440px){
                    font-size: 16px;
                    padding: 5px 25px;
                    margin: 5px 5px;
                    height: 45px;
                }
                @media(max-width:1440px){
                    padding: 5px 20px;
                    height: 40px;
                }
                @media(max-width:767px){
                    min-width: 80px; 
                    padding: 3px 15px;
                    height: 35px;
                }
            }
        }
    }
    .load-more{
        display: flex;
        justify-content: center;
        font-size: 20px;
        border: 1px solid #B4B4B4;
        border-radius: 52px;
        width: 200px;
        height: 54px;
        margin: auto;
        margin-top: 40px;
        &:hover,
        &.active{
            background-color:var(--primaryColor);
            color: #fff;
            border-color : var(--primaryColor);
        }
        button{
            border: none;
            background: transparent;
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

function Explore(props) {
    const [assetType, setAssetType] = useState('')
    const [search, setSearch] = useState("")

    const [items, setItems] = useState([])
    const [page, setPage] = useState(1)
    const [noItems, setNoItems] = useState(false)
    const [initialItemsLoaded, setInitialItemsLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {    
        setItems([])
        setNoItems(false)
        setInitialItemsLoaded(false)
        setLoading(true)   
        setPage(1)    
        fetchItems(true)    
    }, [props,search,assetType])
    
    useEffect(() => {
        setLoading(true)    
        if (initialItemsLoaded){
            fetchItems(false);
        }
    }, [page])
    
    function fetchItems(reset){  
        let query = `/api/item/?sale=true`;         
        let queryUrl = `${query}&page=${reset ? 1 : page}${assetType ? '&assetType=' + assetType : ''}${search ? '&search=' + search : ''}`
            
        axios.get(queryUrl)
        .then(res => {
            setLoading(false)   
            if (res.data.items.length === 0) setNoItems(true)      
            if (reset){        
                setItems(res.data.items)
                setInitialItemsLoaded(true)
            }else{
                let prevArray = JSON.parse(JSON.stringify(items))
                prevArray.push(...res.data.items)
                setItems(prevArray)        
            }            
        })
        .catch(err => {            
            setLoading(false)  
            if (err.response.data.message === 'No Items found') {
                setNoItems(true)    
            }      
        })
    }
    
    function loadMore() {
        if (!loading) {
            setPage(page => {return (page + 1)}) 
        }      
    }

    return (
        <div className="pg-explore">
            <Header {...props}/>
            
            <ExploreContent>
                <div className="container">
                    <div className="filter-box">
                        <div className="sectionHeading">
                            <h2>Explore</h2>
                        </div>                        
                        <div className="inputField">
                            <div className="inputGroup">
                                <input type="text" className="fm-input" placeholder="Search" 
                                    onChange={e => setSearch(e.target.value)} value={search}/>
                                <button className="search-button" >
                                    <img src={SearchIcon} alt="saerchIcon"/>
                                </button>
                            </div>
                        </div> 
                        
                        <ul className="filterLinks">
                            <li onClick={() => setAssetType('')}><div className={assetType==='' ? 'active' : ''}>ALL</div></li>
                            <li onClick={() => setAssetType('image')}><div className={assetType==='image' ? 'active' : ''}>🎨 Art</div></li>
                            <li onClick={() => setAssetType('audio')}><div className={assetType==='audio' ? 'active' : ''}>🎵 Audio</div></li>
                            <li onClick={() => setAssetType('video')}><div className={assetType==='video' ? 'active' : ''}>🎥 Video</div></li>
                        </ul>
                    </div>
                    <div className="exploreList">
                        <div className="row-wrap">
                            {
                                items.map((item, index)=> <div className="box-12 box-md-6 box-lg-4 box-xl-3">
                                        <Nft key={index} {...props} item={item}/>
                                    </div>)  
                            }                            
                        </div>  
                        <div className="load-more" style={{display: noItems ? "none" : ""}}>
                            <button onClick={() => loadMore()} className="" type="primary" >
                                {loading ? "Loading..." : "Load more"}
                            </button>
                        </div>                        
                    </div>
                    
                </div>
            </ExploreContent>

            <Footer />
        </div>
    );

}

export default Explore;


