import React, { useEffect, useState } from "react";
import { formatNum } from "../../utils";
import TokenIcon from '../../assets/images/token.png';
// musicList images



function EventNode(props) { 
   const {event} = props;
   const [timeAgo, setTimeAgo] = useState('');
   useEffect(() => {
      setInterval(() => setNewTime(), 1000);
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
      // onClick={() => props.history.push('/editprofile')}
  };  
   return (
      <tr>                                                
         <td class="event">{event.name}</td>
         <td class="price">{event.price > 0 ? <><img src={TokenIcon} alt="Activity"/>{formatNum(event.price)}</> : ''}</td>
         <td class="from">{event.fromUser ? <><img src={event.fromUser.profilePic} alt="Activity" onClick={() => props.history.push(`/profile/${event.fromUser.address}`)}/> {event.fromUser.name} </> : ''}</td>
         <td class="to">{event.toUser ? <><img src={event.toUser.profilePic} alt="Activity" onClick={() => props.history.push(`/profile/${event.toUser.address}`)}/>{event.toUser.name}</> : ''}</td>
         <td class="date">{timeAgo}</td>
      </tr>
   );
}

export default EventNode;


