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
      searchTextExpanded: '',
      companies,
      companiesBySymbol,
      searchResults: [],
      similarWordsFor: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.doSearch = debounce(this.doSearch, 250);
    this.requestSimilarWords = this.requestSimilarWords.bind(this);

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
    this.setState({searchText}, () => {
      console.log('aaa');
      this.doSearch();
    });
  }

  doSearch() {
    const {searchText, similarWordsFor} = this.state;

    // First - Queue up any similar word lookups needed.
    const searchWords = searchText.match(/\S+/g) || [];
    const searchWordsToLookUp = searchWords.filter(word => !similarWordsFor.hasOwnProperty(word));
    for (const word of searchWordsToLookUp) {
      this.requestSimilarWords(word);
    }

    // Second - expand the searchText by adding all similar words.
    let wordsSimiliarToSearch = [];
    const searchWordsLookedUp = searchWords.filter(word => similarWordsFor[word]);
    for (const word of searchWordsLookedUp) {
      wordsSimiliarToSearch = wordsSimiliarToSearch.concat( similarWordsFor[word].map(x => x.word) );
    }

    // Third - save the expanded searchText and do the actual search.
    const searchTextExpanded = (searchText + " " + wordsSimiliarToSearch.join(" ")).trim();
    this.setState({searchTextExpanded}, () => this.doSearchFinal());
  }

  doSearchFinal() {
    const {searchTextExpanded} = this.state;
    const searchResults = this.searchIdx.search(searchTextExpanded);
    this.setState({searchResults});
  }

  requestSimilarWords(word) {
    // Set the result to false so we don't queue up multiple lookups while the first is running
    this.setState({similarWordsFor: {
      ...this.state.similarWordsFor, [word]: false
    }});

    fetch('http://192.168.1.174:5555/api/similar/' + encodeURIComponent(word)) 
      .then((resp) => {
        if (resp.status !== 200) {
          throw new Error("Api broke :(");
        }
        return resp.json();
      })
      .then((data) => {
        if (data.result && Array.isArray(data.result) && data.result.length > 0) {
          this.setState({similarWordsFor: {
            ...this.state.similarWordsFor, [word]: data.result
          }});
          this.doSearch();
        }
        // If there's no result, we already recorded the result as 'false' above
      });
  }

    /*
    +    "Symbol": "MMM",
    +    "Name": "3M Company",
    +    "Sector": "Industrials",
    +    "Description": "3M Company (3M) is a diversified technology company. The Company operates in six segments: industrial and transportation; hea
    */

  render() {
    const {searchText, searchTextExpanded} = this.state;

    const {searchResults, companiesBySymbol} = this.state;
    const searchResultSymbols = searchResults.map(x => x.ref);

    const searchWords = searchTextExpanded.match(/\S+/g) || [];

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
              <div>{searchTextExpanded}</div>
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
