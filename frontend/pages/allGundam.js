import Layout from '../components/layout'
import Head from 'next/head'
import config from '../config/config'
import styles from '../styles/Home.module.css'
import Navbar from '../components/navbar'
import { useState , useEffect} from 'react'
import axios from 'axios'
import withAuth from '../components/withAuth'
const Getuse = ({ token }) => {
    const [gundams , Setgundams] = useState({})
    const [user , setUser] =useState({})
    const [username , setusername] =useState("")
    const [email ,setemail]=useState("")
    const [classuser, setclassuser] = useState(1)
    useEffect(()=>{
      getusers(),
      profileUser()
    },[])
    const profilegundam = async () => {
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
    const Updategundam = async(id) =>{
      if( +gundam.classgundam  <= 1 )
    {
      let gundam = await axios.put(`${config.URL}/profile/${id}`,{gundamname,email})
      Setgundams(gundam.data)
    }
    else
      alert("Need loging")
    }
    const getgundams = async() =>{
        
        
          let gundam = await axios.get(`${config.URL}/gundam`)
          Setgundams(gundam.data)
          console.log('gundams: ',gundam.data)
        
      
    }
    const Deletegundam= async(id) =>{
    let pass = await axios.get(`${config.URL}/class/${id}`)
    setclassgundam(pass.data)
    if( +gundam.classgundam  <= 1 )
    {
      let gundam = await axios.delete(`${config.URL}/profile/${id}`)
      Setgundams(gundam.data)
    }
    else
      alert("Need Login")
    }
    const addgundam = async (gundamname,email) => {
     let gundam = await axios.post(`${config.URL}/profile/${id}`,{gundamname,email})
     Setgundams(gundam.data)
    }
    const printgundams =() => {
      if(gundams.gundams && gundams.gundams.length)
      return gundams.gundams.map((item,index) => 
      <li key ={index}>
          number : {index+1} ,
          Name : {item.gundamname} , 
          Email : {item.email}
          <button onClick={()=>Updategundam(item.id)}>Update</button>
          <button onClick={()=>Deletegundam(item.id)}>Delete</button>
          </li>
       )
      else  
        return (<li>No gundam</li>)
    }
    return (
    <Layout>
        <Head>
            <title>All uers</title>
        </Head>
      <div className={styles.container}>
        <Navbar />
        <br></br>
        <h1>gundam List</h1>
        {printgundams()}
      <h2>Edit gundam</h2>
      Name: <input type="text" onChange={(e)=>setgundamname(e.target.value)}/><br/>
      email:<input type="text" onChange={(e)=>setemail(e.target.value)}/><br/>
      
      </div>
      </Layout>
    )
  }
  export default withAuth(Getuse)

  export function getServerSideProps({ req, res }) {
      return { props: { token: req.cookies.token || "" } };
  }
