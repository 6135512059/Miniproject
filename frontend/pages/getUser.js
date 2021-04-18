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
      let user = await axios.put(`${URL}/${id}`,{username,email})
      Setusers(user.data)
    }
    const getusers = async() =>{
      
        let user = await axios.get(`${config.URL}/user`)
        Setusers(user.data)
        console.log('users: ',user.data)
      
    }
    const Deleteuser= async(id) =>{
      let user = await axios.delete(`${URL}/${id}`)
      Setusers(user.data)
    }
    const adduser = async (username,email) => {
     let user = await axios.post(URL ,{username,email})
     Setusers(user.data)
    }
    const getuser =async(id) =>{
      let user = await axios.get(`${URL}/${id}`)
      Setuser({username: user.data.username ,email: user.data.email})
    }
    const printusers =() => {
      if(users.users && users.users.length)
      return users.users.map((item,index) => 
      <li key ={index}>
          : {index+1}
          : {item.userusername} 
          : {item.email}
          <button onClick={()=>getuser(item.id)}>get</button>
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
        {printusers()}
        Select user: {user.username} : {user.email}
      <h2>Add user</h2>
      <input type="text" onChange={(e)=>setusername(e.target.value)}/><br/>
      <input type="number" onChange={(e)=>setemail(e.target.value)}/><br/>
      <button onClick={()=>adduser(username,email)}>ADD</button>
      
      </div>
      </Layout>
    )
  }

