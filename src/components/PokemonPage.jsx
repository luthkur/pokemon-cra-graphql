import { useParams } from 'react-router-dom';
import usePersistedState from 'use-persisted-state-hook';
import { useForm } from "react-hook-form";
import {  useQuery,
    gql
} from "@apollo/client";
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

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

const PokemonDetail = (params) => {
    const [, setPokemonOwned] = usePersistedState('pokemonOwned', []);
    const [ getPokemon, setgetPokemon ] = useState(false);
    const [ catchMessage, setCatchMessage] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        let pokemonData = JSON.parse(data.pokemondata);
        setPokemonOwned(pokemonOwned => [...pokemonOwned, {owned_id: uuidv4(), pokemon_data: pokemonData, nickname: data.nickname}]);
        setgetPokemon(false);
        setCatchMessage(null)
    }

    let nickNameForm = null;
    let catchButton = <button onClick={() => 
        {
          if (Math.random() < 0.5)  {
            setCatchMessage(<p>successfuly catch</p>)
            setgetPokemon(true);
          }
          else {
            setCatchMessage(<p>failed to catch</p>)
          }
        }
      }>Catch Pokemon</button>

    const { loading, error, data } = useQuery(GET_POKEMON_DETAIL, {variables: params});
  
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
  
    console.log('Response from server', data);

    if(getPokemon) { 
        nickNameForm = 
        <div>
            <p>You got a {data.pokemon.name}, Please give it a nickname</p>
            <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}        
            {/* include validation with required or other standard HTML validation rules */}
            <input
            type="hidden"
            defaultValue={JSON.stringify(data.pokemon)}
            {...register('pokemondata')}
            />
            <input {...register("nickname", { required: true })} />
            {/* errors will return when field validation fails  */}
            {errors.nickname && <span>This field is required</span>}
            
            <input type="submit" value="Submit Name"/>
            </form>
        </div>
        catchButton = null;
    }

    let moves = data.pokemon.moves.map(({move}) => <li>
      {move.name}
    </li>);
    let types = data.pokemon.types.map(({type}) => <li>
    {type.name}
  </li>);
    return (
      <div>
        <p>
          {data.pokemon.name}          
        </p>
        <img src={data.pokemon.sprites.front_default} alt={data.pokemon.name}/>
        <br/>
        {catchMessage}
        {catchButton}
        {nickNameForm}
        <p>
          Moves :
          </p>
        <ol>
          {moves}
        </ol>
        <p>
          Types :
        </p>
        <ol>
          {types}
        </ol>
      </div>
    );
  };

function PokemonPage() {
    let { name } = useParams();
  
    return (
      <div>
        <h2>Pokemon Page {name}</h2>
        <PokemonDetail name={name}></PokemonDetail>
      </div>
    );
  }

export default PokemonPage;