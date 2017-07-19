import React, { Component } from 'react';
import Highlighter from 'react-highlight-words';

class SearchResultItem extends Component {
  constructor() {
    super();
    this.state = {
      hover: false
    };
  }

  render() {
    const {company, searchWords} = this.props;
    //const {hover} = this.state;
    const hover = true;
    return (
      <div className="tl ba pa2 pa3-ns ma2 ma3-ns bg-light-green black measure-wide"
        onMouseOver={() => this.setState({ hover: true })} 
        onMouseOut={() => this.setState({ hover: false })}
      >
        <div className="f3 mb2">
          <Highlighter
            searchWords={searchWords}
            textToHighlight={company.Name}
          />
        </div>
        <p className="f5 measure-wide lh-copy">
          { hover &&
            <Highlighter
              searchWords={searchWords}
              textToHighlight={company.Description}
            />
          }
          { !hover &&
              <span>
                {company.Description}
              </span>
          }
        </p>

      </div>
    );
  }
}

export default SearchResultItem;
