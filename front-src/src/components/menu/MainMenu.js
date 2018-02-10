import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ROUTES } from '../../config';
import { toggleMenu } from '../../actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MENU_WIDTH } from '../../config';
import IconButton from 'material-ui/IconButton';
import ActionMenu from 'material-ui/svg-icons/navigation/menu';

class MainMenu extends Component {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
        menuOpen: true
    }

    static propTypes = {
        menuOpen: PropTypes.bool
    }

    renderActiveClass(path) {
        if (String(this.props.location.pathname).startsWith(path)) {
            return `menu-link menu-active-color`;
        } else {
            return `menu-link`;
        }
    }

    renderDot(path) {
        if (String(this.props.location.pathname).startsWith(path)) {
            return <span className="menu-active"></span>;
        }
    }    

    computeMenuCSS() {
        if (this.props.menuOpen) {
            return {
                width: MENU_WIDTH,
                display: 'block'
            }
        } else {
            return {
                display: 'none'
            }            
        }
    }

    render() {
        this.renderActiveClass();
        return(
            <div className="main-menu-ui" style={this.computeMenuCSS()}>
                <div className="close-menu-button">
                    <IconButton iconStyle={{ color: '#FFFFFF' }} onClick={ e => this.props.toggleMenu(false) }>
                        <ActionMenu />
                    </IconButton>
                </div>

                <div className="admin-logo">
                    <img src="/images/logo-air-push.png" />
                    <p className="logo-text">AirPush.io</p>
                </div>
                <ul className="menu-list">
                    <li>
                        <Link className={this.renderActiveClass(`${ROUTES.CHAT_ROOM}`)} to={`${ROUTES.CHAT_ROOM}`}>
                            {this.renderDot(`${ROUTES.CHAT_ROOM}`)}
                            <span className="menu-label">Chat group</span>
                        </Link>                                               
                    </li>
                    <li>
                        <Link className={this.renderActiveClass('/app/friends')} to="/app/friends">
                            <span className="menu-label">Friends</span>
                        </Link>                                               
                    </li>                    
                    <li>
                        <Link className={this.renderActiveClass('/app/main')} to="/app/main">
                            <span className="menu-label">Settings</span>
                        </Link>                                               
                    </li>
                    <li>
                        <Link className={this.renderActiveClass('/app/main')} to="/app/main">
                            <span className="menu-label">My account</span>
                        </Link>                                               
                    </li>                                        
                </ul>
            </div>
        );
    }
}

const mapStateToProps = ({ menuOpen }, ownProps) => {
    return {
        menuOpen
    }
}

export default withRouter(connect(mapStateToProps, {toggleMenu})(MainMenu));
