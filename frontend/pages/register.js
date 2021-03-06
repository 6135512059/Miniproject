
import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import Navbar from '../components/navbar'
import axios from 'axios'
import config from '../config/config'

export default function Register({ token }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password1, setPassword1] = useState('')
    const [status, setStatus] = useState('')
    const [classuser, setclassuser] = useState(1)
    const profileUser = async () => {
        console.log('token: ', token)
        const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log('user: ', users.data)
    }

    const register = async (req, res) => {
        if(password === password1)
        {try {
            let result = await axios.post(`${config.URL}/register`,
                { username, email, password ,classuser})
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.data.message)
        }
        catch (e) {
            console.log(e)
        }}
        else
            alert("passwordไม่เท่ากัน โปรดใส่ค่าใหม่")
    }

    const registerForm = () => (
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
                Email:
            </div>
            <div>
                <input type="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                Password:
            </div>
            <div>
                <input type="password"
                    name="password"
                    placeholder="Firstpassword"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                Password:
            </div>
            <div>
                <input type="password"
                    name="password2"
                    placeholder="Secondpassword"
                    onChange={(e) => setPassword1(e.target.value)} />
            </div>
        </div>
    )


    return (
        <Layout>
            <Head>
                <title>Register</title>
            </Head>
            <div className={styles.container}>
                <Navbar />
                <h1>Register</h1>
                <div>
                </div>
                <br />
            Status:  {status}
                <br /><br />
                <div className={styles.content}>
                    {registerForm()}
                </div>

                <div>
                    <button onClick={register} className={styles.buttonAqua}>Register</button>
                </div>
            </div>
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
