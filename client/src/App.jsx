import './App.css';
import Loader from "./components/Loader/Loader.jsx";
import { useSelector } from "react-redux";
import Router from './router/Router.jsx';

function App() {
  const { loading } = useSelector((state) => state.loader);

  return (
    <div className="App">
      {loading && <Loader />}
      <Router />
    </div>
  )
}

export default App

