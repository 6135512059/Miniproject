import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios' 

const URL ='http://localhost/api/gundam'
export default function Home() {
  const [gundam , Setgundam] = useState({})
  const [name , setname] =useState('')
  const [weight ,setweight]=useState(0)
  const [gundam , Setgundam] = useState({})
  useEffect(()=>{
    getgundam()
  },[])
  const Updategundam = async(id) =>{
    let gundam = await axios.put(`${URL}/${id}`,{name,weight})
    Setgundam(gundam.data)
  }
  const getgundam = async() =>{
    
      let gundam = await axios.get(URL)
      Setgundam(gundam.data)
      console.log('gundam: ',gundam.data)
    
  }
  const Deletegundam= async(id) =>{
    let gundam = await axios.delete(`${URL}/${id}`)
    Setgundam(gundam.data)
  }
  const addgundam = async (name,weight) => {
   let gundam = await axios.post(URL ,{name,weight})
   Setgundam(gundam.data)
  }
  const getgundam =async(id) =>{
    let gundam = await axios.get(`${URL}/${id}`)
    Setgundam({name: gundam.data.name ,weight: gundam.data.weight})
  }
  const printgundam =() => {
    if(gundam.list && gundam.list.length)
    return gundam.list.map((item,index) => 
    <li key ={index}>
        : {index+1}
        : {item.name} 
        : {item.weight}
        <button onClick={()=>getgundam(item.id)}>get</button>
        <button onClick={()=>Updategundam(item.id)}>Update</button>
        <button onClick={()=>Deletegundam(item.id)}>Delete</button>
        </li>
     )
    else  
      return (<li>No gundam</li>)
  }
  return (
    <div>gundam
      
      {printgundam()}
      Select gundam: {gundam.name} : {gundam.weight}
    <h2>Add gundam</h2>
    <input type="text" onChange={(e)=>setname(e.target.value)}/><br/>
    <input type="number" onChange={(e)=>setweight(e.target.value)}/><br/>
    <button onClick={()=>addgundam(name,weight)}>ADD</button>
    
    </div>
  )
}