import NewComment from "./components/NewComment";
import PostsList from "./components/PostsList";

import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <PostsList />
      <NewComment />
    </div>
  );
}

export default App;
