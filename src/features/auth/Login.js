import { useRef, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useLoginMutation } from "./authApiSlice"
import { setCredentials } from "./authSlice"
import usePersist from "../../hooks/usePersist"

const Login = () => {

  const userRef = useRef()
  const errRef = useRef()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  const errClass = errMsg ? 'errmsg' : 'offscreen'

  if(isLoading) <p>Loading...</p>

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/dash')
    } catch (error) {
      if(!error.status) {
        setErrMsg('No server response')
      } else if(error.status === 400) {
        setErrMsg('Missing username or password')
      } else if(error.status === 401) {
        setErrMsg('Wrong username or password')
      } else {
        setErrMsg(error.data?.message)
      }
    }


  }

  const handleUserInput = e => setUsername(e.target.value)
  const handlePassword = e => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)
  
  
  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
          className="form__input"
          id="username"
          type="text"
          ref={userRef}
          value={username}
          onChange={handleUserInput}
          autoComplete="off"
          required
          />
          <label htmlFor="password">Password</label>
          <input 
          className="form__input"
          id="password"
          type="password"
          value={password}
          onChange={handlePassword}
          required
          />
          <button className="form__submit">Sign In</button>
          <label htmlFor="persist" className="form__persist">
          <input 
          className="form__checkbox"
          id="persist"
          type='checkbox'
          onChange={handleToggle}
          checked={persist}
          />
          Remember me</label>
        </form>
      </main>
      <footer>
        <Link to='/'>Home</Link>
      </footer>
    </section>
  )
  return content
}

export default Login