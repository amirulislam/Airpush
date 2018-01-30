import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleMenu } from '../actions';
import { MENU_WIDTH } from '../config';

class AppSectionUI extends Component {

    static defaultProps = {
        menuOpen: true
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (window.innerWidth < 600) {
            this.props.toggleMenu(false);
        }
    }

    renderPaddingCSS() {
        return (this.props.menuOpen) ? {paddingLeft: MENU_WIDTH} : {paddingLeft: '0px'};
    }

    render() {
        this.renderPaddingCSS();
        return(
            <div className="app-section" style={this.renderPaddingCSS()}>
                { this.props.children }
            </div>
        )
    }
}

AppSectionUI.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    menuOpen: PropTypes.bool
}

const mapStateToProps = ({ menuOpen }, ownProps) => {
    return {
        menuOpen
    }
}

export default connect(mapStateToProps, { toggleMenu })(AppSectionUI);
