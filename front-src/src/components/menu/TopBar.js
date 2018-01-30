import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MENU_WIDTH } from '../../config';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ActionMenu from 'material-ui/svg-icons/navigation/menu';
import { toggleMenu, logOut } from '../../actions';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LogoutIcon from 'material-ui/svg-icons/content/remove-circle-outline';

class TopBar extends Component {

    static defaultProps = {
        menuOpen: true
    }

    renderPaddingCSS() {
        return (this.props.menuOpen) ? {paddingLeft: MENU_WIDTH} : {paddingLeft: '0px'};
    }

    renderOpenMenuButton() {
        if (!this.props.menuOpen) {
            return(
                <div className="open-menu-button pull-left">
                    <IconButton tooltip="Open menu" onClick={ e => this.props.toggleMenu(true) }>
                        <ActionMenu />
                    </IconButton>
                </div>
            );
        }
    }

    renderUserAvatar() {
        if (this.props.authenticated) {
            return(
                <div className="user-avatar pull-right">
                    <IconMenu
                        iconButtonElement={
                            <FlatButton
                                label={this.props.authenticated.name}
                                labelPosition="before"
                                containerElement="label"
                                icon={<Avatar
                                src={this.props.authenticated.photo}
                                size={35}
                                />}
                            />                            
                        }
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                        <MenuItem primaryText="My account" leftIcon={<AccountIcon />} />
                        <MenuItem primaryText="Settings" leftIcon={<SettingsIcon />} />
                        <Divider />
                        <MenuItem onClick={e => this.props.logOut()} primaryText="Log out" leftIcon={ <LogoutIcon /> } />
                    </IconMenu>                           
                </div>
            );
        }
    }

    render() {
        return(
            <div className="top-bar-main" style={this.renderPaddingCSS()}>
                { this.renderOpenMenuButton() }
                { this.renderUserAvatar() }
                <div className="clearfix"></div>
            </div>
        );
    }
}

const mapStateToProps = ({ menuOpen, authenticated }, ownProps) => {
    return {
        menuOpen,
        authenticated
    }
}

TopBar.propTypes = {
    menuOpen: PropTypes.bool,
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),    
}

export default connect(mapStateToProps, { toggleMenu, logOut })(TopBar);

