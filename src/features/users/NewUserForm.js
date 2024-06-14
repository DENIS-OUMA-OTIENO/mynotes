import { useNavigate } from "react-router-dom"
import { useCreateUserMutation } from "./UsersApiSlice"
import { useEffect, useState } from "react"
import { ROLES } from "../../config/roles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const USER_REGEX = /^[A-z]{3,20}$/
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
  const [createNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useCreateUserMutation()

  const navigate = useNavigate()

  const[username, setUsername] = useState('')
  const[validUsername, setValidUsername] = useState('false')
  const[password, setPassword] = useState('')
  const[validPassword, setValidPassword] = useState(false)
  const[roles, setRoles] = useState(['Employee'])

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username]) 

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password))
  }, [password])
  
  //reset the state of username, password and roles if isSuccess is true
  useEffect(() => {
    if(isSuccess){
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate])

  //handlers
  const onUsernameChanged = (event) => {
    setUsername(event.target.value)
  }

  const onPasswordChanged = (event) => {
    setPassword(event.target.value)
  }

  const onRolesChanged = (event) => {
      const values = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      )
      setRoles(values)
  }

  const canSave = roles.length && validPassword && validUsername && !isLoading
  const onSaveUserClicked = async(event) => {
    event.preventDefault()
    if(canSave) {
      await createNewUser({ username, password, roles })
    }
  }

  const options = Object.values(ROLES).map(role => {
    return (
      <option
      key={role}
      value={role}
      >
        {role}
      </option>
    )
  })

  const errClass = isError ? 'errmsg' : 'offscreen'
  const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass = !validPassword ? 'form__input--complete' : ''
  const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
  
  const content = (
    <>
    <p className={errClass}>{error?.data?.message}</p>
    <form className='form' onSubmit={onSaveUserClicked}>
      <div className="form__title-row">
        <h2>New User</h2>
        <div className="form__action-buttons">
          <button
          className="icon__button"
          title="save"
          disabled={!canSave}
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      </div>
      <label className="form__label" htmlFor="username">username</label>
      <input
      className={`form__input ${validUserClass}`}
      id="username"
      name="username"
      type="text"
      autoComplete="off"
      value={username}
      onChange={onUsernameChanged}
      />
      

      <label className="form__label" htmlFor="password">password</label>
      <input
      className={`form__input ${validPwdClass}`}
      id="password"
      name="password"
      type="password"
      autoComplete="off"
      value={password}
      onChange={onPasswordChanged}
      />
      

      <label className="form_label" htmlFor="roles">roles</label>
      <select
      className={`form__select ${validRolesClass}`}
      id="roles"
      name="roles"
      multiple={true}
      size='3'
      value={roles}
      onChange={onRolesChanged}
      >
        {options}
      </select>
      
    </form>
    </>
  )
  
  return content
  
}

export default NewUserForm