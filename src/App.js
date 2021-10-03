import styled from "@emotion/styled";
import {
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

import Home from './components/Home';
import PokemonPage from './components/PokemonPage';
import MyPokemonPage from './components/MyPokemonPage'

const AppContainer = styled.div`
  text-align: center;
`;

const AppHeader = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;



function App() {
  const history = useHistory();

  function handleClick() {
    history.push("/");
  }
  return (
    <AppContainer>
      <AppHeader>
    <div className="App">
      <div>
        <ul>
          <li>
            <Link to="/">Pokemon List</Link>
          </li>
          <li>
            <Link to="/mypokemon">My Pokemon List</Link>
          </li>
        </ul>

        <hr />
        <button
          onClick={handleClick}>
          Go home
        </button>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/mypokemon">
            <MyPokemonPage />
          </Route>
          <Route path="/pokemon/:name">
            <PokemonPage />
          </Route>
        </Switch>
      </div>
    </div>
    </AppHeader>
    </AppContainer>
  );
}


export default App;
