import React, { Component } from 'react';

class SearchPage extends Component {
  componentDidMount() {
    this.inputSearch.focus();
  }
  render() {
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
