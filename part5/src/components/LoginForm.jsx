import { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async event => {
    event.preventDefault()
    await onLogin({ username, password })
    setPassword('')
  }

  return (
    <form onSubmit={submit} className="loginForm">
      <h2>Log in to application</h2>
      <label>username
        <input aria-label="username" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>password
        <input aria-label="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">login</button>
    </form>
  )
}
export default LoginForm