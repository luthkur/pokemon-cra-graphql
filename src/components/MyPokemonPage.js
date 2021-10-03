import usePersistedState from 'use-persisted-state-hook';

export const MyPokemonList = (props) => {
    let { pokemonOwned,setPokemonOwned } = props;
    return pokemonOwned.map(({ owned_id, name, nickname }, index) => {
      return (
        <div key={owned_id}>
          <p>{name}</p>
          <p>{nickname}</p>
          <button owned_id={owned_id} onClick={(e) => {
            const owned_id = e.target.getAttribute("owned_id")
            return setPokemonOwned(pokemonOwned.filter(pokemon => pokemon.owned_id !== owned_id))
          }
          }>Releease {nickname}</button>
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
  
  function MyPokemonPage() {
    return (
      <div>
        <h2>MyPokemon</h2>
        <PokemonOwned></PokemonOwned>
      </div>
    );
  }

export default MyPokemonPage;