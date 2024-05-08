import './App.css';
import 'materialize-css';
import {BrowserRouter as Router} from 'react-router-dom';
import {useRoutes} from "./routes";

function App() {
    const routes = useRoutes(false)
  return (
      <Router>
        <div className="container">
            {routes}
        </div>
      </Router>
  );
}

export default App;
