import React, { Component } from 'react';
import SearchResultItem from './SearchResultItem';

import companies from '../data/companies';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      companies,
      matchingCompanies: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.doSearch = this.doSearch.bind(this);

    /*
    this.state['searchText'] = 'test';
    setTimeout( () => {
      this.doSearch('test');
    }, 100);
    */
  }

  componentDidMount() {
    this.inputSearch.focus();
  }

  handleChange(event) {
    const searchText = event.target.value;
    this.setState({searchText});
    this.doSearch(searchText);
  }

  doSearch(searchText) {
    const matchingCompanies = this.state.companies.filter(x => x.Name.includes(searchText) || x.Description.includes(searchText));
    this.setState({matchingCompanies});
  }

    /*
    +    "Symbol": "MMM",
    +    "Name": "3M Company",
    +    "Sector": "Industrials",
    +    "Description": "3M Company (3M) is a diversified technology company. The Company operates in six segments: industrial and transportation; hea
    */

  render() {
    const {searchText} = this.state;

    const {matchingCompanies} = this.state;
    //console.log({companies});

    return (
      <div>

        <div className="bt b--black-10 black-70 pa2 pa4-ns">
          <form className="black-80">
            <div className="measure center">
              <input 
                ref={x => this.inputSearch = x}
                onChange={this.handleChange}
                value={searchText}
                type="text"
                placeholder="search..."
                className="input-reset f3 ba b--black-20 pa2 mb2 db w-100"
              />
            </div>
          </form>
        </div>

        {searchText && 
          <div className="black-70 pa2 pa4-ns">
            Found {matchingCompanies.length} results.
            {matchingCompanies.map((company) =>
              <SearchResultItem key={company.Symbol} company={company} searchWords={[searchText]} />
            )}
          </div>
        }
      </div>
    );
  }
}

export default SearchPage;
