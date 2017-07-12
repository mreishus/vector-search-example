import React, { Component } from 'react';

import companies from '../data/companies';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies
    };
  }

  componentDidMount() {
    this.inputSearch.focus();
  }

  render() {
    let {companies} = this.state;

    //console.log({companies});

    return (
      <div className="bt b--black-10 black-70 pa2 pa4-ns">
        <form className="pa4 black-80">
          <div className="measure center">
            <input 
              ref={x => this.inputSearch = x}
              type="text"
              placeholder="search..."
              className="input-reset f3 ba b--black-20 pa2 mb2 db w-100"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default SearchPage;
