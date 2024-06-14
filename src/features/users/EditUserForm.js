import { useNavigate } from "react-router-dom"
import { useDeleteUserMutation, useUpdateUserMutation } from "./UsersApiSlice"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,12}$/



const EditUserForm = ({ user }) => {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError, 
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delError
    }] = useDeleteUserMutation()

    const navigate =  useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState(user.password)
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if(isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async(e) => {
        if(password) {
            await updateUser({ id: user.id, username, password, roles, active})
        } else {
            await updateUser({ id: user.id, username, roles, active})
        }
    }

    const onDeleteUserClicked = async() => {
        await deleteUser({ id: user.id })
    }

    let canSave
    if(password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
            key={role}
            value={role}
            >{roles}</option>
        )
    })

    const errClass = (isError || isDelError) ? 'errmsg' : 'offscreen'
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const content = (
        <>
        <p className={errClass}>{errContent}</p>
        <form className="form" onSubmit={e => e.preventDefault()}>
            <div className="form__title-row">
                <h2>User</h2>
                <div>
                    <button
                    className="icon__button"
                    title="save"
                    onClick={onSaveUserClicked}
                    disabled={!canSave}
                    >
                        <FontAwesomeIcon  icon={faSave} />
                    </button>
                    <button
                    title="delete"
                    onClick={onDeleteUserClicked}
                    disabled={canSave}
                    >
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>

                </div>
            </div>

                    <label className="form__label" htmlFor="username">username
                    <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={onUsernameChanged}
                    />
                    </label>

                    <label className="form__label" htmlFor="password">password
                    <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                    />
                    </label>  

                    <label className="form__label form__checkbox-container">Active:
                    <input
                    className="form__checkbox"
                    id="user-active"
                    name="user-active"
                    type="checkbox"
                    checked={active}
                    onChange={onActiveChanged}
                    />
                    </label>

                    <label className="form__label" htmlFor="roles" >Assigned Roles</label> 
                    <select
                    className={`form__select ${validRolesClass}`}
                    id="roles"
                    name="roles"
                    multiple={true}
                    size="3"
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

export default EditUserForm