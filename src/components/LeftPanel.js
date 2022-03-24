import React from "react";
import _ from "lodash";
import { Button, Container, Grid, Header, Image, Message } from "semantic-ui-react";
import { connect } from "react-redux";

import "./LeftPanel.css";
import WordGrid from "./WordGrid"
import {
  defaultColor,
  inputError,
  wordListError
} from "../data/initialState";
import {
  fullReset,
  onSubmit,
  showErrorMessage,
  showSuccessMessage
} from "../actions";


class LeftPanel extends React.Component {

  submit = () => {
    if (this.props.letterColors.indexOf(defaultColor) > -1) {
      this.props.showErrorMessage(true);
    } else {
      this.props.onSubmit();
    }
  }

  successMessage() {
    return (
      <Container textAlign="left">
        <Message
          header="Congradulations!"
          content={`Together we have successfully solved the word in ${this.props.rowKey + 1} tries!`}
          positive
        />
      </Container>
    );
  }

  errorMessage(header, content) {
    return (
      <Container textAlign="left">
        <Message
          header={header}
          content={content}
          negative
        />
      </Container>
    );
  }

  render() {
    return (
        <Grid container>

          <Grid.Row className="header-row" columns="equal">
              <Header as="h1" textAlign="left">
                <Image src={require("../data/logo.png")} size="big" circular />
                Wordle Solver
              </Header>
          </Grid.Row>

          <WordGrid />

          <Grid.Row className="reset-row">
            <Container>
              <Button
                className="reset-button"
                onClick={() => this.props.fullReset()}
                size="large"
                content="Reset"
              />
            </Container>
          </Grid.Row>

          <Grid.Row className="error-row">
            {/* Input Error Message */}
            { this.props.errorMessageValue === inputError ?
              this.errorMessage(
              "Invalid Input",
              "You must choose a color for each letter. Do not leave it colorless."
              ) : null
            }

            {/* WordList Error Message */}
            { this.props.errorMessageValue === wordListError ? 
              this.errorMessage(
                "Word Not Found",
                "There is no word in the Wordle word list that fits the given parameters."
              ) : null
            }

            {/* Success Message */}
            { this.props.successMessageValue ? this.successMessage() : null }
          </Grid.Row>

        </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return { 
    errorMessageValue: state.errorMessageValue,
    letterColors: state.allGuesses[state.rowKey].colors,
    rowKey: state.rowKey,
    successMessageValue: state.successMessageValue,
    wordList: state.wordList
  };
}

export default connect(mapStateToProps,
  { fullReset, onSubmit, showErrorMessage, showSuccessMessage }
)(LeftPanel);