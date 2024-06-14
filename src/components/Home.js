import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section>
      <header>
        <h1>Notes App</h1>
      </header>

      <main>
        <p>An awesome app digitize the process of note taking.</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
};

export default Home;
