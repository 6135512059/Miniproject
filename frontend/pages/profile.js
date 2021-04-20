import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'
import { useRouter } from 'next/router'

const Profile1 = ({ token }) => {
    const router = useRouter()
    const [user, setUser] = useState({})
    useEffect(() => {
        profileUser()
    }, [])
 
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
    const Edituser = () => {
        if (user.classuser == 0)
        return <div>
                <button onClick={GotoEdit}>Edit User</button>                      
               </div>
    }
    const GotoEdit = () =>{
      router.push('/getUser')
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
                {Edituser()}                       
                </div>
            </div>
        </Layout>
    )
}

export default withAuth(Profile1)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
