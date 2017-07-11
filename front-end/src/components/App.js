import React, { Component } from 'react';
import '../App.css';
import Header from './Header';
import SearchPage from './SearchPage';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <SearchPage />
      </div>
    );
  }
}

export default App;
