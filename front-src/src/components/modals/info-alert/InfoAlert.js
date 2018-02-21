import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { OPEN_INFO_ALERT, ALERT_MESSAGES_TYPES } from '../../../actions/Types';
import { SOCKET_MESSAGE_TYPES } from '../../../config';
import RommFullAlert from './RoomFullAlert';
import AlreadyConnectedAlert from './AlreadyConnectedAlert';
import MyAccountAlert from './MyAccountAlert';
import MediaNeededAlert from './MediaNeededAlert';
import SettingsModal from './SettingsModal';
import InstallExtensionAlert from './InstallExtensionAlert';

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
                return <RommFullAlert title="Participants limit" maxWidth={400} data={this.props.infoAlertData} />
            break;
            case SOCKET_MESSAGE_TYPES.ALREADY_CONNECTED_ERROR:
                return <AlreadyConnectedAlert title="Connection usage" maxWidth={400} data={this.props.infoAlertData} />
            break;
            case ALERT_MESSAGES_TYPES.MY_ACCOUNT:
                return <MyAccountAlert title="My account" maxWidth={600} data={this.props.infoAlertData} />
            break;
            case ALERT_MESSAGES_TYPES.MELDIA_NEEDED:
                return <MediaNeededAlert title="User media needed" maxWidth={500} data={this.props.infoAlertData} />
            break;
            case ALERT_MESSAGES_TYPES.OPEN_SETTINGS:
                return <SettingsModal title="Settings" maxWidth={500} data={this.props.infoAlertData} />
            break;
            case ALERT_MESSAGES_TYPES.SHOW_INSTALL_EXTENSION:
                return <InstallExtensionAlert title="Chrome extension install" maxWidth={400} data={this.props.infoAlertData} />
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
