import Head from 'next/head'
import Layout from '../components/layout'
import { useState } from 'react'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import config from '../config/config'
import { useRouter } from 'next/router'
import { getLocationOrigin } from 'next/dist/next-server/lib/utils'
//6135512059 patiparn 
export default function Login({ token }) {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const [remember, setRemember] = useState('')
    
    const login = async (req, res) => {
        try {
            if(remember == 'on')
                alert("Rememer User")
            let result = await axios.post(`${config.URL}/login`,
                { username, password ,remember},
                { withCredentials: true })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.status + ': ' + result.data.user.username)
            setUsername('')
            setPassword('')
            router.push('/profile')
           
        }
        catch (e) {
            console.log('error: ', JSON.stringify(e.response))
            setStatus(JSON.stringify(e.response).substring(0, 80) + "...")
        }
            
    }

    const loginForm = () => (
        <div className={styles.gridContainer}>
            <div>
                Username:
            </div>
            <div>
                <input type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                Password:
            </div>
            <div>
                <input type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            
        </div>
    )
    const GuestloginForm = () => {
        setUsername('un_user')
        setPassword('0000')
        if(!username)
        {
            setUsername('un_user')
            setPassword('0000')  
        }
        else
            login()
    }
    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>
            <div className={styles.container}>
                <Navbar />
                <h1>Login</h1>
                <br/>
                <div>
                    Status:  {status}
                </div>
                <br />
                {loginForm()}
                <input type="checkbox" name = "remember"  onChange={(e) => setRemember(e.target.value)}/> 
                <button onClick={GuestloginForm} className={styles.buttonGreen}> Guest login </button>
                <div>
                 <button onClick={login} className={styles.buttonAqua}>Login</button>
               
                </div>  
                </div>
                
                
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
