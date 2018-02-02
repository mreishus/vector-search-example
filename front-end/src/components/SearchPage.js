import React, { Component } from "react";
import SearchResultItem from "./SearchResultItem";

import companies from "../data/companies";
import lunr from "lunr";
import debounce from "debounce";

// Takes no props.

class SearchPage extends Component {
  constructor() {
    super();

    const companiesBySymbol = companies.reduce((obj, item) => {
      obj[item.Symbol] = item;
      return obj;
    }, {});

    this.state = {
      searchText: "", // String, what the user is searching for.
      searchTextExpanded: "", // String, is searchText concatenated with all similiar words found from service.
      companies, // [{Symbol: string, Name: string, Sector: string, Description: string}, ...]
      companiesBySymbol, // { AAPL: {Symbol: string, Name: string, Sector: string, Description: string}, ... }
      searchResults: [], // [{ref: string, score: double, matchData: ?}, ..].  The ref here is the company Symbol.
      similarWordsFor: {}, // {string => Array(string), ...}, representing similiar words found from service
      isWordApiError: false, // Did we come across an error looking up the API?
      wordApiUrl: "http://192.168.1.174:5555/api/similar/",
      wordApiUrlDefault: "http://127.0.0.1:8080/api/similar/"
    };

    // We build the search index when the component is first mounted.
    this.searchIdx = lunr(function() {
      this.ref("Symbol");
      this.field("Name");
      this.field("Description");
      companies.forEach(doc => {
        this.add(doc);
      });
    });

    // Binds, would prefer to replace with transform-class-properties and arrow functions
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleApiChange = this.handleApiChange.bind(this);
    this.requestSimilarWords = this.requestSimilarWords.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.doSearch = debounce(this.doSearch, 250);
  }

  componentDidMount() {
    this.inputSearch.focus();
  }

  // User typed into search box
  handleSearchChange(event) {
    const searchText = event.target.value;
    this.setState({ searchText }, () => {
      this.doSearch();
    });
  }

  // User typed into API address box
  handleApiChange(event) {
    this.setState({ wordApiUrl: event.target.value });
  }

  // Forget all search results and try again
  resetSearch() {
    this.setState({ similarWordsFor: {} }, () => {
      this.doSearch();
    });
  }

  // (1) Send requests for similar words to the api,
  // (2) Save any expanded words we've found to searchTextExpanded (so we can show the user),
  // (3) Then do the actual search by calling doSearchFinal().
  // As the requests from (1) finish, they will call doSearch() again.  It's debounced by 250ms.
  doSearch() {
    const { searchText, similarWordsFor } = this.state;

    // First - Queue up any similar word lookups needed.
    // Split on whitespace and look up all of those words.
    const searchWords = searchText.match(/\S+/g) || [];
    const searchWordsToLookUp = searchWords.filter(
      word => !similarWordsFor.hasOwnProperty(word)
    );
    for (const word of searchWordsToLookUp) {
      this.requestSimilarWords(word);
    }

    // Second - expand the searchText by adding all similar words.
    let wordsSimiliarToSearch = [];
    const searchWordsLookedUp = searchWords.filter(
      word => similarWordsFor[word]
    );
    for (const word of searchWordsLookedUp) {
      wordsSimiliarToSearch = wordsSimiliarToSearch.concat(
        similarWordsFor[word].map(x => x.word)
      );
    }

    // Third - save the expanded searchText and do the actual search.
    const searchTextExpanded = (
      searchText +
      " " +
      wordsSimiliarToSearch.join(" ")
    ).trim();
    this.setState({ searchTextExpanded }, () => this.doSearchFinal());
  }

  // Perform a search with the information we have loaded into state (user request + similar words).
  doSearchFinal() {
    const { searchTextExpanded } = this.state;
    const searchResults = this.searchIdx.search(searchTextExpanded);
    this.setState({ searchResults });
  }

  // Kick off an API request for a similar word.
  requestSimilarWords(word) {
    const { wordApiUrl } = this.state;
    // Set the result for this word to false, so we don't queue up multiple lookups while the first is running
    this.setState({
      similarWordsFor: {
        ...this.state.similarWordsFor,
        [word]: false
      }
    });

    fetch(wordApiUrl + encodeURIComponent(word))
      .then(resp => {
        if (resp.status !== 200) {
          throw new Error("Api broke :(");
        }
        return resp.json();
      })
      .then(data => {
        this.setState({ isWordApiError: false });
        if (
          data.result &&
          Array.isArray(data.result) &&
          data.result.length > 0
        ) {
          this.setState({
            similarWordsFor: {
              ...this.state.similarWordsFor,
              [word]: data.result
            }
          });
          this.doSearch();
        }
        // If there's no result, we already recorded the result as 'false' above
      })
      .catch(() => {
        this.setState({ isWordApiError: true });
      });
  }

  /*
    +    "Symbol": "MMM",
    +    "Name": "3M Company",
    +    "Sector": "Industrials",
    +    "Description": "3M Company (3M) is a diversified technology company. The Company operates in six segments: industrial and transportation; hea
    */

  render() {
    const {
      searchText,
      searchTextExpanded,
      searchResults,
      companiesBySymbol,
      isWordApiError,
      wordApiUrl
    } = this.state;

    const searchResultSymbols = searchResults.map(x => x.ref);
    const searchWords = searchTextExpanded.match(/\S+/g) || [];

    return (
      <div>
        <div className="bt b--black-10 black-70 pa2 pa4-ns">
          <form className="black-80">
            <div className="measure center">
              <input
                ref={x => (this.inputSearch = x)}
                onChange={this.handleSearchChange}
                value={searchText}
                type="text"
                placeholder="search..."
                className="input-reset f3 ba b--black-20 pa2 mb2 db w-100 br3"
              />

              {/*
              <article class="center mw5 mw6-ns hidden ba mv4">
                <h1 class="f4 bg-near-black white mv0 pv2 ph3">
                  test
                </h1>
                <div class="pa3 bt">
                  <p class="f6 f5-ns lh-copy measure mv0">
                    {searchTextExpanded}
                  </p>
                </div>
              </article>
              */}

              <div>{searchTextExpanded}</div>
            </div>
          </form>
        </div>

        {isWordApiError && (
          <div className="black-70 pa2 pa4-ns bg-washed-red measure center">
            <p className="mt0">Error contacting similar words API.</p>
            Change the API address:
            <input
              onChange={this.handleApiChange}
              value={wordApiUrl}
              className="input-reset f4 ba b--black-20 pa1 mb2 db w-100"
            />
            <button onClick={this.resetSearch}>Try again</button>
          </div>
        )}

        {searchText && (
          <div className="black-70 pa2 pa4-ns">
            Found {searchResults.length} results.
            {searchResultSymbols.map(symbol => (
              <SearchResultItem
                key={symbol}
                company={companiesBySymbol[symbol]}
                searchWords={searchWords}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default SearchPage;
