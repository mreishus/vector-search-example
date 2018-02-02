// @flow
import React, { Component } from "react";
import Highlighter from "react-highlight-words";

type Props = {
  company: any,
  searchWords: Array<string>
};
type State = {
  hover: boolean
};

class SearchResultItem extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      hover: false
    };
  }

  render() {
    const { company, searchWords } = this.props;

    const hover = true; // For now, let's disable the hover-to-hightlight function

    return (
      <div
        className="tl ba pa2 pa3-ns ma2 ma3-ns bg-light-green black measure-wide br3"
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
          {hover && (
            <Highlighter
              searchWords={searchWords}
              textToHighlight={company.Description}
            />
          )}
          {!hover && <span>{company.Description}</span>}
        </p>
      </div>
    );
  }
}

export default SearchResultItem;
