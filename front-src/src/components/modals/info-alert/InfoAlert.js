import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { OPEN_INFO_ALERT } from '../../../actions/Types';
import { SOCKET_MESSAGE_TYPES } from '../../../config';
import RommFullAlert from './RoomFullAlert';
import AlreadyConnectedAlert from './AlreadyConnectedAlert';

class InfoAlert extends Component {

    static defaultProps = {
        infoAlertData: false
    }

	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
    }

	render() {
        if (!this.props.infoAlertData) {
            return <noscript />;
        }
        switch(this.props.infoAlertData.alertType) {
            case SOCKET_MESSAGE_TYPES.ROOM_FOOL_ERROR:
                return <RommFullAlert maxWidth={400} data={this.props.infoAlertData} />
            break;
            case SOCKET_MESSAGE_TYPES.ALREADY_CONNECTED_ERROR:
                return <AlreadyConnectedAlert maxWidth={400} data={this.props.infoAlertData} />
            break;            
            default:
            return <noscript />;
        }
	}
}

InfoAlert.propTypes = {
    infoAlertData: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),
}

const mapStateToProps = ({ infoAlertData }, ownProps) => {
    return {
        infoAlertData
    }
}

export default connect(mapStateToProps)(InfoAlert);
