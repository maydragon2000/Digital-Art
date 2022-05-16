import React, {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Header from '../header/header';
import {Footer} from '../footer/footer'

import ActivityNode from './activity-node';
import styled from 'styled-components';

// Activity images
import ActivityList1 from '../../assets/images/activitylist-1.png';
import ActivityList2 from '../../assets/images/activitylist-2.png';
import ActivityList3 from '../../assets/images/activitylist-3.png';
import ActivityList4 from '../../assets/images/activitylist-4.png';

const ActivityContent = styled.div`
    padding: 60px 0 100px;
    .sectionHeading{
        h2{
            margin: 0;
            margin-bottom: 30px;
            @media(max-width:1440px){
                margin-bottom: 40px;
            }
            @media(max-width:767px){
                margin-bottom: 20px;
            }
        }
    }
    .tabContent{
        margin-bottom: 60px;
        .inner-wrap{
            padding-right: 28px;
        }
        .Heading{
            ul{
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
                a{
                    font-weight: 600;
                    font-size: 24px;
                    line-height: 36px;
                    padding: 10px 20px;
                    color: #000;
                    margin-bottom: -3px;
                    display: inline-block;
                    transition: all .6s;
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
        .content-box{
            .listBox{
                .item-box{
                    display: grid;
                    grid-template-columns: 1fr 4fr;
                    grid-gap: 18px;
                    margin-top: 38px;
                    .img-box{
                        img{
                            border-radius: 8px;
                            max-width: 140px;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                    .info-box{
                        h3{
                            margin: 0;
                            margin-bottom: 5px;
                            font-weight: 600;
                        }
                        p{
                            font-size: 20px;
                            line-height: 30px;
                            margin: 0;
                            @media(max-width:1440px){
                                font-size: 16px;
                                line-height: 23px;
                            }
                            .time{
                                color: rgba(0, 0, 0, 0.4);
                            }
                        }
                        .authorBy{
                            font-size: 20px;
                            line-height: 30px;
                            .by{
                                color: rgba(0, 0, 0, 0.4);
                            }
                        }
                    }
                } 
            }
        }
    }
    
    .filterSidebar{
        .inner-wrap{
            padding-top: 54px;
        }
        .sideFilter{
            max-width: 370px;
            margin-left: auto;
            background: #FFFFFF;
            box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            padding: 35px 40px;
            @media(max-width:991px){
                max-width:100%;
            }
            .heading{
                padding: 16px 0 20px;
                h4{
                    margin: 0;
                    font-weight: bold;
                    border-bottom: 3px solid var(--primaryColor); 
                    display: inline-block;
                }
            }
            .linkList{
                margin: 0 -10px;                
                .active{
                    background-color:var(--primaryColor);
                    color: #fff;
                    border-color : var(--primaryColor);
                }
            }            
        }        
    }
    button{
        display: inline-block;
        font-size: 14px;
        padding: 11px 16px;
        background: rgba(112, 68, 155, 0.05);
        border: 1px solid var(--primaryColor);
        border-radius: 5px;
        margin: 6px;
        transition: all .3s ease;
        cursor: pointer;                    
    }
    .load-more{
        display: flex;
        justify-content: center;
        margin-top: 40px;        
    }
`

function Activity(props) {
    const { account, active, chainId, library } = useWeb3React();
    const [filter, setFilter] = useState('')
    
    const [events, setEvents] = useState([])
    const [page, setPage] = useState(1)
    const [noEvents, setNoEvents] = useState(false)
    const [initialEventsLoaded, setInitialEventsLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {    
        setEvents([])
        setNoEvents(false)
        setInitialEventsLoaded(false)
        setLoading(true)   
        setPage(1)    
        fetchEvents(true)    
    }, [account,filter])
    
    useEffect(() => {
        setLoading(true)    
        if (initialEventsLoaded){
            fetchEvents(false);
        }
    }, [page])
    
    function fetchEvents(reset){          
        if (account) {
            console.log(account)
            let query = `/api/item/activities/?address=${account}`;         
            let queryUrl = `${query}&page=${reset ? 1 : page}${filter ? '&filter=' + filter : ''}`                
            axios.get(queryUrl)
            .then(res => {
                setLoading(false)   
                if (res.data.events.length === 0) setNoEvents(true)      
                if (reset){        
                    setEvents(res.data.events)
                    setInitialEventsLoaded(true)
                }else{
                    let prevArray = JSON.parse(JSON.stringify(events))
                    prevArray.push(...res.data.items)
                    setEvents(prevArray)        
                }            
            })
            .catch(err => {            
                setLoading(false)  
                if (err.response?.data.message === 'No events found') {
                    setNoEvents(true)    
                }      
            })
        }
    }
    function loadMore() {
        if (!loading) {
            setPage(page => {return (page + 1)}) 
        }      
    }


    function setMinted(){
        if (filter === 'Minted') {
            setFilter('')
        } else {
            setFilter('Minted')
        }        
    }
    function setListed(){
        if (filter === 'Listed') {
            setFilter('')
        } else {
            setFilter('Listed')
        }         
    }
    function setDelisted(){
        if (filter === 'Delisted') {
            setFilter('')
        } else {
            setFilter('Delisted')
        }
    }
    function setPurchased(){
        if (filter === 'Sold') {
            setFilter('')
        } else {
            setFilter('Sold')
        }        
    }

    return (
        <div className="pg-ativity">
            <Header {...props}/>
            
            <ActivityContent>
                <div className="container">
                    <div className="sectionHeading">
                        <h2>Activity</h2>
                    </div>
                    <div className="row-wrap">
                        <div className="box-12 box-lg-8 tabContent">
                            <div className="inner-wrap">
                                <div className="content-box" data-hide="1">
                                    <div className="listBox">                                        
                                        {
                                            events.map((event, index)=> 
                                            <ActivityNode {...props} event={event}/>)  
                                        }                                                                                                                         
                                    </div>
                                    <div className="load-more" style={{display: noEvents ? "none" : ""}}>
                                        <button onClick={() => loadMore()} className="" type="primary" >
                                            {loading ? "Loading..." : "Load more"}
                                        </button>
                                    </div>
                                </div>                                
                            </div>
                            
                        </div>
                        <div className="box-12 box-lg-4 filterSidebar">
                            <div className="inner-wrap">
                                <div className="sideFilter">
                                    <div className="heading">
                                        <h4>Filters</h4>
                                    </div>
                                    
                                    <div className="linkList">
                                        <button onClick={() => setMinted()} className={filter === 'Minted' ? 'active' : ''}>Minted</button>
                                        <button onClick={() => setListed()} className={filter === 'Listed' ? 'active' : ''}>Listed</button>
                                        <button onClick={() => setDelisted()} className={filter === 'Delisted' ? 'active' : ''}>Delisted</button>
                                        <button onClick={() => setPurchased()} className={filter === 'Sold' ? 'active' : ''}>Purchased</button>                                        
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </ActivityContent>

            <Footer/>
        </div>
    );
    
}

export default Activity;

