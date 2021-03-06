import Head from 'next/head' 
import Layout from '../components/layout' 
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

export default function Home({ token }) {
  const router = useRouter()
  const GotoLogin = () =>{
    router.push('/login')
  }
  const GotoRegister = () =>{
    router.push('/register')
  }
  return (
    <Layout>
    <Head>
        <title>First Page</title>
    </Head>
    <div className={styles.container}>
        <Navbar />
        <h1>Home page</h1>
        Welcom เพจนี้เขียนโดย 6135512059<br/>
        เพื่อความสะดวอกโปรดล็อกอิน<br/>
        เพจนี้ มี Admin ชื่อ pung<br/>
        
        <button onClick={GotoLogin} className={styles.buttonGreen}>Login</button>
        <button onClick={GotoRegister} className={styles.buttonGreenli}>Register</button>  
    </div>
</Layout>
  )
}

export function getServerSideProps({ req, res }) {
  // console.log("token from cookie: ",cookie.get("token")) 
  // console.log('req: ', req.headers)
  return { props: { token: req.cookies.token || "" } };
}
