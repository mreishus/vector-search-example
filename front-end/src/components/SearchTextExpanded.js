// @flow
import React from "react";

type Props = {
  searchTextExpanded: string
};

class SearchTextExpanded extends React.Component<Props> {
  render() {
    const { searchTextExpanded } = this.props;
    if (searchTextExpanded == "") {
      return null;
    }
    return (
      <div class="pa3 bt bg-light-green br3">
        <p class="f6 f5-ns lh-copy measure mv0">{searchTextExpanded}</p>
      </div>
    );
  }
}

export default SearchTextExpanded;
