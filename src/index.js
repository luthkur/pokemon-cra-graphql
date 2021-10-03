import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyles from "./global-styles";
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

import {
  BrowserRouter as Router,
} from "react-router-dom";

const client = new ApolloClient({
  uri: 'https://graphql-pokeapi.graphcdn.app',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          pokemons: {
              // The keyArgs list and merge function are the same as above.
              keyArgs: [],
              merge(existing = {results: []}, incoming) {
                let objectParams = {};
                objectParams = Object.assign(objectParams, incoming);
                if(existing) objectParams.results = [...existing.results , ...objectParams.results];
                return objectParams;
              },
          }       
          }      
        }
      }
    }
  )
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <GlobalStyles />
      <Router>
      <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
