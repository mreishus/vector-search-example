import React, { Component } from 'react';
import SearchResultItem from './SearchResultItem';

import companies from '../data/companies';
import lunr from 'lunr';
import debounce from 'debounce';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    let companiesBySymbol = companies.reduce((obj, item) => {
      obj[item.Symbol] = item;
      return obj;
    }, {});

    this.state = {
      searchText: '',
      companies,
      companiesBySymbol,
      searchResults: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.doSearch = debounce(this.doSearch, 250);

    this.searchIdx = lunr(function() {
      this.ref("Symbol");
      this.field("Name");
      this.field("Description");
      companies.forEach(doc => {
        this.add(doc);
      });
    });

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
    const searchResults = this.searchIdx.search(searchText);
    this.setState({searchResults});
  }

    /*
    +    "Symbol": "MMM",
    +    "Name": "3M Company",
    +    "Sector": "Industrials",
    +    "Description": "3M Company (3M) is a diversified technology company. The Company operates in six segments: industrial and transportation; hea
    */

  render() {
    const {searchText} = this.state;

    const {searchResults, companiesBySymbol} = this.state;
    const searchResultSymbols = searchResults.map(x => x.ref);
    //console.log({companies});

    const searchWords = searchText.match(/\S+/g) || [];

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
            Found {searchResults.length} results.
            {searchResultSymbols.map((symbol) =>
              <SearchResultItem key={symbol} company={companiesBySymbol[symbol]} searchWords={searchWords} />
            )}
          </div>
        }
      </div>
    );
  }
}

export default SearchPage;
