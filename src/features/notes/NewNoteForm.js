import { useEffect, useState } from "react";
import { useCreateNoteMutation } from "./NotesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewNoteForm = ({ users }) => {
  const [createNewNote, {isSuccess, isLoading, isError, error}] =
    useCreateNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onTitleChange = (e) => setTitle(e.target.value);
  const onTextChange = (e) => setText(e.target.value);
  const onUserIdChange = (e) => setUserId(e.target.value);

  const canSave = userId && title && text && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await createNewNote({ user: userId, title, text });
    }
  };

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });
  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : ''
  const validTextClass = !text ? "form__input--incomplete" : ''

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="form__action-buttons" title="save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={onTitleChange}
        />
        <label className="form__label" htmlFor="text">
          Text
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          type="text"
          value={text}
          onChange={onTextChange}
        />

        <label className="form__label" htmlFor="userId">
          Assigned to:
        </label>
        <select
        className="form__select"
          id="username"
          name="username"
          value={userId}
          onChange={onUserIdChange}
        >
          {options}
        </select>
      </form>
    </>
  );
  return content;
};

export default NewNoteForm;
