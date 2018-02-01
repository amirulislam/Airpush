import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import _ from 'lodash';
import PropTypes from 'prop-types';

class Notifications extends Component {

    static defaultProps = {
        notification: false
    }

	constructor(props) {
		super(props);
		this.state = {
			message: '',
			open: false,
			closeTime: 1800
		}
    }
    
    componentWillReceiveProps({ notification }) {
        if (notification) {
            this.setState({
                message: notification.message,
                open: true
            })
        }
    }

	render() {
		return(
			<Snackbar
	        	open={ this.state.open }
	        	message={ this.state.message }
	        	autoHideDuration={ this.state.closeTime }
	        />			
		);
	}
}

Notifications.propTypes = {
    notification: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),
}

const mapStateToProps = ({ notification }, ownProps) => {
    return {
        notification
    }
}

export default connect(mapStateToProps)(Notifications);
