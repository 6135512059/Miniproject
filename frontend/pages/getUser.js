import Layout from '../components/layout'
import Head from 'next/head'
import config from '../config/config'
import styles from '../styles/Home.module.css'
import Navbar from '../components/navbar'
import { useState , useEffect} from 'react'
import axios from 'axios'
import withAuth from '../components/withAuth'
import { useRouter } from 'next/router'

const Getuse = ({ token }) => {
    const router = useRouter()
    const [users , Setusers] = useState({})
    const [user , setUser] =useState({})
    const [username , setusername] =useState("")
    const [email ,setemail]=useState("")
    const [classuser, setclassuser] = useState(1)
    useEffect(()=>{
      getusers(),
      profileUser()
    },[])
    const profileUser = async () => {
      try {
          // console.log('token: ', token)
          const users = await axios.get(`${config.URL}/profile`, {
              headers: { Authorization: `Bearer ${token}` }
          })
          // console.log('user: ', users.data)
          setUser(users.data)
      }
      catch (e) {
          console.log(e)
      }

  }
    const Updateuser = async(id) =>{
      if( +user.classuser  <= 1 )
    {
      let user = await axios.put(`${config.URL}/profile/${id}`,{username,email})
      Setusers(user.data)
    }
    else
      alert("Need loging")
    }
    const getusers = async() =>{
        
        
          let user = await axios.get(`${config.URL}/alluser`)
          Setusers(user.data)
      
          console.log('users: ',user.data)
        
      
    }
    const Deleteuser= async(id) =>{
    let pass = await axios.get(`${config.URL}/class/${id}`)
    setclassuser(pass.data)
    if( +user.classuser  <= classuser )
    {
      let user = await axios.delete(`${config.URL}/profile/${id}`)
      Setusers(user.data)
    }
    else
      alert("Need Login")
    }
    const adduser = async (username,email) => {
     let user = await axios.post(`${config.URL}/profile/${id}`,{username,email})
     Setusers(user.data)
    }
    const ReturnProfile = () =>{
      router.push('/profile')
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
       
        <br></br>
        <h1>User List</h1>
        {printusers()}
      <h2>Edit user</h2>
      Name: <input type="text" onChange={(e)=>setusername(e.target.value)}/><br/>
      email:<input type="text" onChange={(e)=>setemail(e.target.value)}/><br/>
      <button onClick={ReturnProfile}>Profile</button>
      </div>
      </Layout>
    )
  }
  export default withAuth(Getuse)

  export function getServerSideProps({ req, res }) {
      return { props: { token: req.cookies.token || "" } };
  }
