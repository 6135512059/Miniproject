import Layout from '../components/layout'
import Head from 'next/head'
import config from '../config/config'
import styles from '../styles/Home.module.css'
import Navbar from '../components/navbar'
import { useState , useEffect} from 'react'
import axios from 'axios'
export default function Getuser() {
    const [users , Setusers] = useState({})
    const [username , setusername] =useState('')
    const [email ,setemail]=useState(0)
    const [user , Setuser] = useState({})
    useEffect(()=>{
      getusers()
    },[])
    const Updateuser = async(id) =>{
      let user = await axios.put(`${config.URL}/profile/${id}`,{username,email})
      Setusers(user.data)
    }
    const getusers = async() =>{
      
        let user = await axios.get(`${config.URL}/user`)
        Setusers(user.data)
        console.log('users: ',user.data)
      
    }
    const Deleteuser= async(id) =>{
      let user = await axios.delete(`${config.URL}/profile/${id}`)
      Setusers(user.data)
    }
    const adduser = async (username,email) => {
     let user = await axios.post(`${config.URL}/profile/${id}`,{username,email})
     Setusers(user.data)
    }
    const printusers =() => {
      if(users.users && users.users.length)
      return users.users.map((item,index) => 
      <li key ={index}>
          number : {index+1} ,
          Name : {item.username} , 
          Email : {item.email}
          <button onClick={()=>Updateuser(item.id)}>Update</button>
          <button onClick={()=>Deleteuser(item.id)}>Delete</button>
          </li>
       )
      else  
        return (<li>No user</li>)
    }
    return (
    <Layout>
        <Head>
            <title>All uers</title>
        </Head>
      <div className={styles.container}>
        <Navbar />
        <br></br>
        <h1>User List</h1>
        {printusers()}
      <h2>Add user</h2>
      <input type="text" onChange={(e)=>setusername(e.target.value)}/><br/>
      <input type="text" onChange={(e)=>setemail(e.target.value)}/><br/>
      
      </div>
      </Layout>
    )
  }

