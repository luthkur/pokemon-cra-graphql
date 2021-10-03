import usePersistedState from 'use-persisted-state-hook';
import styled from '@emotion/styled'

export const MyPokemonList = (props) => {

    const PokemonDiv = styled.div`
    padding: 32px;
    margin: 5px;
    background-color: blue;
    border-radius: 4px;
    color: black;
    `
    let { pokemonOwned,setPokemonOwned } = props;
    return pokemonOwned.map(({ owned_id, pokemon_data, nickname }, index) => {
      return (
        <PokemonDiv key={owned_id}>
          <p>Tipe : {pokemon_data.name}</p>
          <img src={pokemon_data.sprites.front_default} alt={nickname}/>
          <p>nickname : {nickname}</p>
          <button owned_id={owned_id} onClick={(e) => {
            const owned_id = e.target.getAttribute("owned_id")
            return setPokemonOwned(pokemonOwned.filter(pokemon => pokemon.owned_id !== owned_id))
          }
          }>Release {nickname}</button>
        </PokemonDiv>
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
      </div>
    )
  }
  
  function MyPokemonPage() {
    return (
      <div>
        <h2>MyPokemon</h2>
        <PokemonOwned></PokemonOwned>
      </div>
    );
  }

export default MyPokemonPage;