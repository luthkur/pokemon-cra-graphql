import usePersistedState from 'use-persisted-state-hook';
import {  useQuery,
    gql
  } from "@apollo/client";
import { Link } from 'react-router-dom';

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

const gqlVariables = {
    limit: 10,
    offset: 0,
  };

const ListPokemon = () => {
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

  const Home = function() {
    return (
      <div>
        <h2>Home</h2>
        <ListPokemon></ListPokemon>
      </div>
    );
  }

export default Home;