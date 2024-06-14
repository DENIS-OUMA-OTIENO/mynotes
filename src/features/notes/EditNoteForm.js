import { useNavigate } from "react-router-dom"
import { useDeleteNoteMutation, useUpdateNoteMutation } from "./NotesApiSlice"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const EditNoteForm = ({ note, users }) => {

  const {isManager, isAdmin } = useAuth()
  const [updateNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateNoteMutation()
  const [deleteNote, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError
  }] = useDeleteNoteMutation()


const navigate = useNavigate()

const [title, setTitle] = useState(note.title)
const [text, setText] = useState(note.text)
const [completed, setCompleted] = useState(note.completed)
const [userId, setUserId] = useState(note.user)

useEffect(() => {
  if(isDelSuccess || isSuccess){
    setTitle('')
    setText('')
    setCompleted('')
    setUserId('')
    navigate('/dash/notes')
  }
}, [isDelSuccess, isSuccess, navigate])

//state setters
const onTitleChanged = e => setTitle(e.target.value)
const onTextChanged = e => setText(e.target.value)
const onCompletedChanged = e => setCompleted(prev => !prev)
const onUserIdChanged = e => setUserId(e.target.value)

const canSave = userId && title && text && !isLoading

const onSaveNoteClicked = async(e) => {
  if(canSave) {
    await updateNote({ id: note.id, user: userId, title, text, completed})
  }
}
const onDeleteNoteClicked = async () => {
  await deleteNote({ id: note.id })
}

const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

const options = users.map(user => {
  return(
    <option
    key={user.id}
    value={user.id}
    >
      {user.username}
    </option>
  )
})

const errClass = isError || isDelError ? 'errmsg' : 'offscreen'
let deleteButton = null
if(isManager || isAdmin) {
  deleteButton = (
    <button
    className="icon-button"
    title="Delete"
    onClick={onDeleteNoteClicked}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  )
}
const content = (<>
  <p className={errClass}>{error?.data?.message || delError?.data?.message}</p>
  <form className="form" onSubmit={e => e.preventDefault()}>
    <div>
      <h2>Edit Note {note.ticket}</h2>
      <button
      title="save"
      disabled={!canSave}
      onClick={onSaveNoteClicked}
      >
        <FontAwesomeIcon icon={faSave} />
      </button>
      {deleteButton}
      </div>
      <label className="form__label" htmlFor="title">Title</label>
      <input
      className="form__input"
      id="title"
      name="title"
      type="text"
      value={title}
      onChange={onTitleChanged}
      />

      <label htmlFor="text">Text</label>
      <textarea
      id="text"
      name="text"
      type="text"
      value={text}
      onChange={onTextChanged}
      />
      <div>
        <div>
      <label htmlFor="completed">Work Complete?</label>
      <input
      id="completed"
      name="completed"
      type="checkbox"
      value={completed}
      onChange={onCompletedChanged}
      />

      <label htmlFor="userId">Assigned to:</label>
      <select
      id="userId"
      name="userId"
      type="checkbox"
      value={userId}
      onChange={onUserIdChanged}
      >
        {options}
      </select>
      </div>
      <div>
        <p>Created on : {created}</p>
        <p>Updated on: {updated}</p>
      </div>
      </div>

  </form>
</>)

return content

}

export default EditNoteForm