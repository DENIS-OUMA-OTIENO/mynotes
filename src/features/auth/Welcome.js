import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const date = new Date();
  const today = Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const { username, isManager, isAdmin } = useAuth()
  const content = (
    <section>
      <p>{today}</p>
      <h1>Welcome {username}</h1>
      
      {(isManager || isAdmin) && <p><Link to="/dash/users">View User settings</Link></p>}
      
      {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
      <p><Link to="/dash/notes">Noteslist</Link></p>
      <p><Link to="/dash/notes/new">Add New Note</Link></p>
    </section>
  );
  return content;
};

export default Welcome;
