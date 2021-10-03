import usePersistedState from 'use-persisted-state-hook';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import {  useQuery,
  gql
} from "@apollo/client";

const GET_POKEMONS = gql`
  query pokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      count
      next
      previous
      status
      message
      results {
        id
        url
        name
        image
      }
    }
  }
`;
const GET_POKEMON_DETAIL = gql`
query pokemon($name: String!) {
  pokemon(name: $name) {
    id
    name
    sprites {
      front_default
    }
    moves {
      move {
        name
      }
    }
    types {
      type {
        name
      }
    }
  }
}
`;

const gqlVariables = {
  limit: 2,
  offset: 0,
};


export const ListPokemon = () => {
  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: gqlVariables,
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  console.log('Response from server', data);
  return data.pokemons.results.map(({ id, name }) => {
    let link = `/pokemon/${name}`
    return (<div key={id}>
      <p>
        <Link to={link}>{id}: {name}</Link>
      </p>
    </div>
    )
  }
  );
};

export const PokemonDetail = (params) => {
  const { loading, error, data } = useQuery(GET_POKEMON_DETAIL, {variables: params});

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  console.log('Response from server', data);
  return (
      <p>
        {data.pokemon.name}          
      </p>
  );
};

function Counter() {
  const [count, setCount] = usePersistedState('count', 0)

  return (
    <div>
      <div>Count is {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
}



function App() {
  return (
    <div className="App">
      <Router>
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

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/mypokemon">
            <MyPokemon />
          </Route>
          <Route path="/pokemon/:name">
            <PokemonPage />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <ListPokemon></ListPokemon>
    </div>
  );
}

function MyPokemon() {
  return (
    <div>
      <h2>MyPokemon</h2>
      <Counter></Counter>
    </div>
  );
}

function PokemonPage() {
  let { name } = useParams();

  return (
    <div>
      <h2>Pokemon Page {name}</h2>
      <PokemonDetail name={name}></PokemonDetail>
    </div>
  );
}


export default App;
