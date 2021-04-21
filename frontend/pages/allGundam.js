import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios' 
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import config from '../config/config'
import { useRouter } from 'next/router'
//const URLjunp = 'https://gundam.fandom.com/wiki/'

export default function Home({ token }) {
  const URLjunp = 'https://gundam.fandom.com/wiki/'
  const router = useRouter()
  const [user , setUser] =useState({})
  const [ID, setID] =useState(0)
  const [Edit, setEdit] =useState(false)
  const [gundams , Setgundams] = useState({})
  const [name , setname] =useState('')
  const [Story ,setStory]=useState('')
  const [type , setType] =useState('')
  const [classgundam , setClassgundam] =useState(0)
  const [gundam , Setgundam] = useState({})
  useEffect(()=>{
    getgundams(),
    getUser()
  },[])
  const getUser = async () => {
        const users = await axios.get(`${config.URL}/userlogin`)  
        setUser(users.data)
  }
  const Updategundam = async(id) =>{
    let gundam = await axios.put(`${config.URL}/gundam/${id}`,{name,type,Story,classgundam})
    Setgundam(gundam.data)
    setEdit(false)
    setClassgundam(0)
    getgundams()
  }
  const getgundam = async(id) =>{
    
      let newgundam = await axios.get(`${config.URL}/gundam/${id}`)
      Setgundam(newgundam.data)
      console.log('gundam: ',gundam.data)
    
  }
  const Deletegundam= async(id) =>{
    if(user.classuser > gundam.classgundam)
      alert("คุณลบข้อมูลนี้ไม่ได้")
    else
    {
      let newgundam = await axios.delete(`${config.URL}/gundam/${id}`)
      Setgundams(newgundam.data)
      setEdit(false)
      getgundams()
    }
    
  }
  const addgundam = async () => {
  setClassgundam(user.classuser)
   let newgundam = await axios.post(`${config.URL}/gundam`,{name,type,Story,classgundam})
   Setgundam(newgundam.data)
   setClassgundam(0)
   getgundams()
   setEdit(false)
  }
  const getgundams =async() =>{
    let newgundams = await axios.get(`${config.URL}/gundam`)
    Setgundams(newgundams .data)
  }
  const EditGundam = (id) =>{
    setID(id)
    getgundam(id)
    if(user.classuser <= 1 && user.classuser >= 0)  
      setEdit(true)
    else
      alert("Need login to Edit")
  }
  const LinktoWiKi = (name) => {
    router.push(`${URLjunp}${name}`)
  }
  const EidtForm = () =>{
    if(Edit)
      { 
        if(user.classuser == 0)
            return <div>
                  <h1>Edit/ADD Gundam</h1>
                  <h3> Gundam: = {gundam.name}</h3>
                  Name: <input type="text" onChange={(e)=>setname(e.target.value)}/><br/>
                  type:<input type="text" onChange={(e)=>setType(e.target.value)}/><br/>
                  Story:<input type="text" onChange={(e)=>setStory(e.target.value)}/><br/>
                  classgundam :<input type="text" onChange={(e)=>setClassgundam(e.target.value)}/><br/>
                  <button onClick={()=>Updategundam(ID)}>Update</button>
                  <button onClick={()=>Deletegundam(ID)}>Delete</button>
                  <button onClick={()=>addgundam(ID)}>ADD</button> 
                  <button onClick={()=>setEdit(false)}>cancel</button>
                  </div>
        else if(user.classuser == 1)
        return <div>
              <h1>Edit/ADD Gundam</h1>
              <h3> Gundam: = {gundam.name}</h3>
              Name: <input type="text" onChange={(e)=>setname(e.target.value)}/><br/>
              type:<input type="text" onChange={(e)=>setType(e.target.value)}/><br/>
              Story:<input type="text" onChange={(e)=>setStory(e.target.value)}/><br/>
              <button onClick={()=>Updategundam(ID)}>Update</button>
              <button onClick={()=>Deletegundam(ID)}>Delete</button> 
              <button onClick={()=>addgundam(ID)}>ADD</button>
              <button onClick={()=>setEdit(false)}>cancel</button>
              </div>
      }
  }
  const AddFrom =() => {
    if(!Edit)
    return <div>
      <button onClick={()=>EditGundam(ID)}>ADD Data</button>
    </div>
  }
  const printgundam =() => {
    
    if(gundams.Gundams && gundams.Gundams.length)
    return gundams.Gundams.map((item,index) => 
    <li key ={index}>
        number: {index+1} ||
        Name: {item.name} ||
        Story: {item.Story} ||
        type: {item.type} :
        <button onClick={()=>EditGundam(item.id)}>Edit</button>
        <button onClick={()=>LinktoWiKi(item.name)}>WiKi</button>  
        </li>
     )
    else  
      return (<li>No gundam</li>)
  }
  return (
    <Layout>
        <Head>
            <title>Gundam list</title>
        </Head>
    <div className={styles.container}>
    <Navbar/>
    <h2>Gundam List</h2>
      {printgundam()} 
      {EidtForm()}
      {AddFrom()}
    </div>
    </Layout>
  )
}