import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
const PendRequest  = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
       fetch('/getPendingRequest',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setData(result)
       })
    },[])


   const acceptRequest=(userid)=>{
     fetch('/acceptRequest',{
         method:"put",
         headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem('jwt')
         },
         body:JSON.stringify({
             followId:userid
         })
     }).then(res=>res.json())
     .then(data2=>{
         dispatch({type:"UPDATE",payload:{following:data2.following,followers:data2.followers}})
          localStorage.setItem("user",JSON.stringify(data2))
          data.filter((item)=>{return item.id!==userid});
     })
   }

   const declineRequest=(userid)=>{
     fetch('/acceptRequest',{
         method:"put",
         headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem('jwt')
         },
         body:JSON.stringify({
             followId:userid
         })
     }).then(res=>res.json())
     .then(data2=>{
         dispatch({type:"UPDATE",payload:{following:data2.following,followers:data2.followers}})
          localStorage.setItem("user",JSON.stringify(data2))
     })
   }

   return (
       <div>
         <ul>
           {
               data.map(item=>{
                   return(
                     <div>
                     <h6>{item.email}</h6>,
                     <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                     onClick={()=>acceptRequest(item._id)}
                     >
                        Accept Request
                     </button>,
                     <button className="btn waves-effect waves-light #64b5f6 green darken-1"
                     onClick={()=>declineRequest(item._id)}
                     >
                        Decline Request
                     </button>
                     </div>
                   )
           }
         )}
          </ul>

       </div>
   )
}


export default PendRequest
