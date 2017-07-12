import React, { Component } from 'react';

class SearchResultItem extends Component {
  render() {
    const {company} = this.props;
    return (
      <div className="tl ba pa2 pa3-ns ma2 ma3-ns bg-light-green black measure-wide">
        <div className="f3 mb2">
          {company.Name}
        </div>
        <p className="f5 measure-wide lh-copy">
          {company.Description}
        </p>

      </div>
    );
  }
}

export default SearchResultItem;
