import React from 'react';
import { Container, Grid, Header, Icon, List, Search, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import WordList from "./WordList";
import { changeSearchWord } from "../actions";

class RightPanel extends React.Component {


  render() {
    return (
      <Container>
        <Grid rows={2} divided="vertically">
          
          <Grid.Row>
            <Container>
              <Header textAlign="center">Possible Words</Header>
            </Container>
          </Grid.Row>

          <Grid.Row>
            <WordList />
          </Grid.Row>

        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wordList: state.wordList,
    searchWord: state.searchWord,
    selectedWord: state.selectedWord
  };
}

export default connect(mapStateToProps, { changeSearchWord })(RightPanel);