import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import "../../styles/letter-selector.css";

export class LetterSelector extends Component {
    static propTypes = {
        filter: PropTypes.func.isRequired
    };

    render() {
        const alphabet = '#0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        return (
            <div className="letter-selector">
                {alphabet.map(letter => <span
                    className="letter" onClick={() => this.props.filter(letter)} key={letter}>
                    {letter}
                    </span>
                )}
            </div>
        )
    }
}