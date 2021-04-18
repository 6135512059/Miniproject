import Head from 'next/head'
import Layout from '../components/layout'
import { useState } from 'react'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import config from '../config/config'
import { useRouter } from 'next/router'
//6135512059 patiparn 
export default function Login({ token }) {
    const router = useRouter()
    const [username, setUsername] = useState('un_user')
    const [password, setPassword] = useState('0000')
    const [status, setStatus] = useState('')
    const [gundam, setGundam] = useState({})
    const [gundamname , setGundamname] =useState('')
    const [weight ,setweight]=useState(0)
    const [beargundams, SetGundams] = useState({})
    const [classuser, setClassuser] = useState('')
    const login = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/login`,
                { username, password },
                { withCredentials: true })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.status + ': ' + result.data.user.username)
        }
        catch (e) {
            console.log('error: ', JSON.stringify(e.response))
            setStatus(JSON.stringify(e.response).substring(0, 80) + "...")
        }
            router.push('/profile')
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
    const GuestloginForm =  () => {
        login()    
    }
    const copyText = () => {
        navigator.clipboard.writeText(token)
    }

    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>
            <div className={styles.container}>
                <Navbar />
                <h1>Login</h1>
                <div><b>Token:</b> {token.substring(0, 15)}...
                <button onClick={copyText}> Copy token </button>
                </div>
                <br/>
                <div>
                    Status:  {status}
                </div>
                <br />
                {loginForm()}
                <button onClick={GuestloginForm}> Guest login </button>
                <div>
                    <button onClick={login}>Login</button>
                </div>  
                </div>
                
                
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
