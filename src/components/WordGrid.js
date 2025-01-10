import React from "react";
import { Button, Grid, Label, Popup } from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";

import {
  changeBufferSize,
  changeColor,
  lockAll,
  onSubmit,
  showErrorMessage,
  showSuccessMessage
} from "../actions";
import {
  colorChoices,
  defaultColor,
  inputError,
  wordList
} from "../data/initialState";
import "./WordGrid.css";

class WordGrid extends React.Component {

  box(letter, color) {
    return (
      <Label
        className="letter-box"
        color={color}
        basic={color === defaultColor}
        size="massive"
        content={letter}
      />
    );
  }

  wordRow = (guess) => {
    const letterArray = [];
    const { colors, locks, word } = guess;

    for (let letterKey = 0; letterKey < word.length; letterKey++) {
      
      letterArray.push(
        <Popup
          trigger={this.box(word[letterKey], colors[letterKey])}
          position="bottom center"
          hoverable
          disabled={locks[letterKey]}
          key={letterKey}
        >
          <Grid columns={3}>
            {this.colorOptions(letterKey)}
          </Grid>
        </Popup>
      );
    }

    return letterArray;
  }

  colorOptions = (letterKey) => {
    return (
      colorChoices.map(color => {
        return(
          <Grid.Column key={color} width={5}>
            <Button
              size="huge"
              color={color}
              onClick={() => this.handleColorChange(letterKey, color)}
            />
          </Grid.Column>
        );
      })
    );
  }

  submitButton = () => {
    return (
      <Button
        className="submit-button"
        content="Submit"
        onClick={() => this.handleSubmit()}
      />
    );
  }

  handleColorChange = (letterKey, color) => {
    this.props.showErrorMessage("");
    this.props.changeColor(letterKey, color);
  }

  

  handleSubmit = () => {
    const rowKey = this.props.rowKey;
    
    if (this.props.allGuesses[rowKey].colors.indexOf(defaultColor) > -1) {
      this.props.showErrorMessage(inputError);
    } else if (_.isEqual(this.props.allGuesses[rowKey].colors, Array(5).fill("green"))) {
      this.props.showSuccessMessage(true)
      this.props.lockAll();
    } else {
      this.props.onSubmit();
    }
  }

  guessGrid = () => {
    let rowKey = -1;
    let buffer = this.props.bufferSize;

    window.addEventListener("resize", () => {

      if (window.innerWidth >= 1200 && this.props.bufferSize !== 4) {
        this.props.changeBufferSize(4)
      } else if (_.inRange(window.innerWidth, 990, 1201) && this.props.bufferSize !== 3) {
        this.props.changeBufferSize(3)
      }
    });

    return this.props.allGuesses.map(guess => {
      rowKey += 1;

      return (
        <Grid.Row className="word-row" columns="equal" verticalAlign="middle" key={rowKey}>
            <Grid.Column width={buffer} />

            <Grid.Column textAlign="center">
              {this.wordRow(guess)}
            </Grid.Column>

            <Grid.Column textAlign="left" width={buffer}>
              {rowKey === this.props.rowKey ? this.submitButton() : null}
            </Grid.Column>
            
        </Grid.Row>
      );
    });
  }

  render() {
    return (
      <Grid className="main-grid" container>
        {this.guessGrid()}
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allGuesses: state.allGuesses,
    bufferSize: state.bufferSize,
    rowKey: state.rowKey,
    wordList: state.wordList
  }
}

export default connect(
  mapStateToProps,
  {
    changeBufferSize, changeColor,
    lockAll, onSubmit,
    showErrorMessage, showSuccessMessage
  })(WordGrid);