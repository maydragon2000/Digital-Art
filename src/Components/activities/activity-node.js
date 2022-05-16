import React, { useEffect, useState } from "react";
import { formatNum } from "../../utils";
import TokenIcon from '../../assets/images/token.png';
// musicList images



function ActivityNode(props) { 
    const {event} = props;
    const [timeAgo, setTimeAgo] = useState('');
    const [actionUser, setActionUser] = useState('');
    useEffect(() => {
        setInterval(() => setNewTime(), 1000);
        if (event.name === 'Listed') {
            setActionUser(event.fromUser.name)
        } else {
            setActionUser(event.toUser.name)
        }
    }, [event]);
    

    const setNewTime = () => {
        const currentTimestamp = new Date().getTime()
        const timestamp = event.timestamp * 1000;        
    
        const distanceToDate = currentTimestamp - timestamp;    
        let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
        if (days > 0) {
            setTimeAgo(`${days} days ago`)
        } else if (hours > 0){
            setTimeAgo(`${hours} hours ago`)
        } else if (minutes > 0){
            setTimeAgo(`${minutes} minutes ago`)
        } else if (seconds > 0){
            setTimeAgo(`${seconds} seconds ago`)
        }       
    };  

    function getActionUser() {

    }

    return (
    <div className="item-box">
        <div className="img-box">
            <img src={event.itemInfo.coverImage} alt="ItemLogo" 
                onClick={() => props.history.push(`/details/${event.tokenId}`)}/>
        </div>
        <div className="info-box">
            <h3>{event.itemInfo.name}</h3>
            <p><span>{event.name}</span> <strong>{event.name === 'Sold' ? `${formatNum(event.price)} ${process.env.REACT_APP_TOKEN}` : ``}</strong> <span className="time">{timeAgo}</span></p>
            <div className="authorBy">
                <div className="by">by</div>
                <strong className="name">{actionUser}</strong>
            </div>
        </div>
    </div>
   );
}

export default ActivityNode;


