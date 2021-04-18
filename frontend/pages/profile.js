import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'

const Profile1 = ({ token }) => {

    const [user, setUser] = useState({})
    const [email, setemail] = useState('')
    const [username , setusername] =useState('')
    const [weight ,setweight]=useState(0)
    const [bearusers, Setusers] = useState({})
    const [classuser, setClassuser] = useState('')
    useEffect(() => {
        profileUser()
    }, [])
    const Edit = () => {
        if(!user)
          return (<li>No information</li>)
        else
        {   <div>
                
            </div>
           
        }
        }
    const rander = () => {
    if(!user)
      return (<li>No information</li>)
    }
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
    const UpdateUser = async(req, res,id) =>{
        let New = await axios.put(`${config.URL}/profile/${id}`,{username,email}, { withCredentials: true })
        setUser(New.data)
      }
      const DeleteUser= async(req, res,id) =>{
        let New = await axios.delete(`${config.URL}/profile/${id}`, { withCredentials: true })
        SetUser(New.data)
      }
    return (
        <Layout>
            <Head>
                <title>User profile</title>
            </Head>
            <div className={styles.container}>
                <Navbar />
                <h1>{user.username}</h1>
                    <li key = {user.id}>
                    Name: {user.username} || 
                    email: {user.email}
                    </li>
                {rander()}
                <div>
                    
                </div>
            </div>
        </Layout>
    )
}

export default withAuth(Profile1)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
