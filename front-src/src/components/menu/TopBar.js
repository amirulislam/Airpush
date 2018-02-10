import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MENU_WIDTH } from '../../config';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ActionMenu from 'material-ui/svg-icons/navigation/menu';
import AllUsers from 'material-ui/svg-icons/hardware/device-hub';
import { toggleMenu, logOut } from '../../actions';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import AccountIcon from 'material-ui/svg-icons/action/account-circle';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LogoutIcon from 'material-ui/svg-icons/content/remove-circle-outline';
import shortid from 'shortid';

class TopBar extends Component {

    static defaultProps = {
        menuOpen: true,
        users: []
    }

    renderPaddingCSS() {
        return (this.props.menuOpen) ? {paddingLeft: MENU_WIDTH} : {paddingLeft: '0px'};
    }

    renderOpenMenuButton() {
        if (!this.props.menuOpen) {
            return(
                <div className="open-menu-button pull-left">
                    <IconButton onClick={ e => this.props.toggleMenu(true) }>
                        <ActionMenu />
                    </IconButton>
                </div>
            );
        }
    }

    redirectToMyAccount() {

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
                        <MenuItem onClick={ e => this.redirectToMyAccount() } primaryText="My account" leftIcon={<AccountIcon />} />
                        <Divider />
                        <MenuItem onClick={e => this.props.logOut()} primaryText="Log out" leftIcon={ <LogoutIcon /> } />
                    </IconMenu>                           
                </div>
            );
        }
    }

    _renderDivider(c, total) {
        if (c < total - 1) {
            return <Divider />;
        }
    }

    _interateUsers() {
        let c = 0;
        return this.props.users.map(u => {
            
            return [
                <div className="users-item" key={shortid.generate()}>
                    <img className="user-img pull-left" src={u.photo} />
                    <p className="pull-left">{u.name}</p>
                    <div className="clearfix"></div>
                </div>,
                <div key={shortid.generate()}>
                    { this._renderDivider(c, this.props.users.length) }
                </div>
            ]
            c++;
        });
    }
    _renderExistingUsers() {
        if (this.props.users.length === 0) {
            return;
        }
        return(
            <div className="users-topbar pull-left">
                <IconMenu
                    iconButtonElement={
                        <FlatButton style={{marginTop: '8px'}}>
                            <AllUsers style={{marginTop: '4px'}} />
                        </FlatButton>                            
                    }
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    >
                    { this._interateUsers() }
                </IconMenu>                           
            </div>           
        )
    }

    render() {
        return(
            <div className="top-bar-main" style={this.renderPaddingCSS()}>
                { this.renderOpenMenuButton() }
                { this._renderExistingUsers() }
                { this.renderUserAvatar() }
                <div className="clearfix"></div>
            </div>
        );
    }
}

const mapStateToProps = ({ menuOpen, authenticated, users }, ownProps) => {
    return {
        menuOpen,
        authenticated,
        users
    }
}

TopBar.propTypes = {
    menuOpen: PropTypes.bool,
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),
    users: PropTypes.array
}

export default connect(mapStateToProps, { toggleMenu, logOut })(TopBar);

