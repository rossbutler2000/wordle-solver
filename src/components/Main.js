import React from 'react';
import _ from 'lodash';
import { Container, Grid, Header, List, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import "./Main.css";

class Main extends React.Component {

  render() {
    return (
      <Container className="main-container" textAlign="center">
        <Segment className="main-segment">
          <Segment className="main-segment" raised>
            <Grid columns="equal" divided>

              <Grid.Column width={10}>
                <LeftPanel />
              </Grid.Column>

              <Grid.Column>
                <RightPanel />
              </Grid.Column>

            </Grid>
          </Segment>
        </Segment>
      </Container>
    );
  }
}

export default Main;
