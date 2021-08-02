import React from 'react';
import { HashRouter } from 'react-router-dom';

import Pokedex from './components/Pokedex';
import Credit from './components/Credit';
import './scss/app.scss';

const App: React.FC = (props) => {
    return (
      <HashRouter>
        <div className="component--app">
            <Pokedex {...props} />
          <Credit />
        </div>
      </HashRouter>
    );
};

export default App;
