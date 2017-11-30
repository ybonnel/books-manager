import React from 'react';
import {PropTypes} from 'prop-types';
import './notification.css';


class Notification extends React.Component {
    static propTypes = {
        action: PropTypes.func.isRequired,
        actionLabel: PropTypes.string.isRequired,
        dismiss: PropTypes.func.isRequired,
        display: PropTypes.bool.isRequired,
        duration: PropTypes.number,
        message: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.startTimer = this.startTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
    }

    componentDidMount() {
        this.startTimer();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.display) {
            this.startTimer();
        }
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    clearTimer() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
    }

    startTimer() {
        this.clearTimer();
        this.timerId = setTimeout(() => {
            this.props.dismiss();
        }, this.props.duration || 5000);
    }

    render() {
        return (
            <div className="notification">
                <p className="notification__message" ref={c => this.message = c}>{this.props.message}</p>
                <a
                    className="notification__button"
                    onClick={this.props.action}
                    ref={c => this.button = c}>{this.props.actionLabel}</a>
            </div>

        );
    }
}

export default Notification;
