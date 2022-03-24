import React from "react";
import { connect } from "react-redux";
import { Container, Icon, List, Search, Segment } from "semantic-ui-react";


import { changeSearchWord, changeWord } from "../actions";
import "./WordList.css";

class WordList extends React.Component {

  searchWordRender = () => {
    let newList = []

    this.props.wordList.forEach(word => {
      if (word.indexOf(this.props.searchWord) > -1) {
        newList.push(word);
      }
    });

    return this.renderWords(newList);
  }

  cancelIcon = () => {
    return <Icon className="cancel" link onClick={() => this.props.changeSearchWord("")}></Icon>
  }

  handleWordChange = (word) => {
    this.props.changeWord(word);
    
  }


  renderWords = (wordList) => {
    return wordList.map(word => {
      return (
        <List.Item key={word} onClick={() => this.handleWordChange(word)}>
          {word == this.props.selectedWord ? <b>{word}</b> : <a>{word}</a>}
        </List.Item>
      );
    });
  }

  render() {
    return (
      <Container>
        <Search
          onSearchChange={e => this.props.changeSearchWord(e.target.value)}
          showNoResults={false}
          input={{ icon: this.cancelIcon() }}
          value={this.props.searchWord}
          placeholder="Search possible words"
        />
        <Segment className="word-box" padded>
          <List horizontal>
            {this.props.searchWord.length > 0 ? this.searchWordRender() : this.renderWords(this.props.wordList)}
          </List>
        </Segment>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wordList: state.wordList,
    searchWord: state.searchWord,
    selectedWord: state.allGuesses[state.rowKey].word
  };
}

export default connect(mapStateToProps, { changeSearchWord, changeWord })(WordList);