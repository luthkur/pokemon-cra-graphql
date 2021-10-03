import usePersistedState from 'use-persisted-state-hook';
import { v4 as uuidv4 } from 'uuid';
import styled from "@emotion/styled";
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
  limit: 10,
  offset: 0,
};

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


export const ListPokemon = () => {
  const [pokemonOwned] = usePersistedState('pokemonOwned', [])
  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: gqlVariables,
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  console.log('Response from server', data);
  return data.pokemons.results.map(({ id, name }) => {
    let link = `/pokemon/${name}`
    let countPokemon = pokemonOwned.filter(OwnedPokemon => OwnedPokemon.pokemon_data_id === id).length  
    return (<div key={id}>
      <p>
        <Link to={link}>{id}: {name}</Link>
      </p>
      <p>
        {countPokemon}
      </p>
    </div>
    )
  }
  );
};

export const PokemonDetail = (params) => {
  const [setPokemonOwned] = usePersistedState('pokemonOwned', [])
  const { loading, error, data } = useQuery(GET_POKEMON_DETAIL, {variables: params});

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  console.log('Response from server', data);
  return (
    <div>
      <p>
        {data.pokemon.name}          
      </p>
      <button onClick={() => 
        {
          if (Math.random() < 0.5)  {
            console.log("success catch")
            return setPokemonOwned(pokemonOwned => [...pokemonOwned, {owned_id: uuidv4(), pokemon_data_id: data.pokemon.id, name: data.pokemon.name}])
          }
          else {
            console.log("failed  catch")
          }
        }
      }>Add Pokemon</button>
    </div>
  );
};

export const MyPokemonList = (props) => {
  let { pokemonOwned,setPokemonOwned } = props;
  return pokemonOwned.map(({ owned_id, name }, index) => {
    return (
      <div key={owned_id}>
        <p>{name}</p>
        <button owned_id={owned_id} onClick={(e) => {
          const owned_id = e.target.getAttribute("owned_id")
          setPokemonOwned(pokemonOwned.filter(pokemon => pokemon.owned_id !== owned_id))
        }
        }></button>
      </div>
    )
  })
}

function PokemonOwned() {
  const [pokemonOwned, setPokemonOwned] = usePersistedState('pokemonOwned', [])
  return (
    <div>
      <div>
      <MyPokemonList pokemonOwned={pokemonOwned} setPokemonOwned={setPokemonOwned}/>
      </div>
      
      <button onClick={() => setPokemonOwned(pokemonOwned => [...pokemonOwned, {id: 1, name: "Bulbasaurus"}])}>Add Pokemon</button>
      <button onClick={() => setPokemonOwned(pokemonOwned => [...(pokemonOwned.slice(0,pokemonOwned.length-1))])}>Remove Pokemon</button>
    </div>
  )
}



function App() {
  return (
    <AppContainer>
      <AppHeader>
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
    </AppHeader>
    </AppContainer>
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
      <PokemonOwned></PokemonOwned>
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
