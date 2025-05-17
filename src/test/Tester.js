import React from 'react';
import { connect } from 'react-redux';


class Tester extends React.Component {

    print = () => {
        console.log("hi")
    }

    render() {
        return <div>{this.print()}</div>
    }
}

const mapStateToProps = ( state ) => {
    return {
        wordList: state.wordList
    }
};

export default connect( mapStateToProps, {} )(Tester);