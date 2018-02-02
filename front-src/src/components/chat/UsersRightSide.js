import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
// import { joinRoomNow } from '../../actions';

class UsersRightSide extends Component {

    static defaultProps = {
        users: []
    }

    constructor(props) {
        super(props);
    }

    _renderUsers() {
        let c = 0;
        return this.props.users.map(user => {
            c++;
            return(
                <div className="user-ui" key={`id-${c}`}>
                    <div className="user-avatar">
                        <IconButton tooltip={user.name || ''} tooltipPosition="top-left">
                            <img className="user-img" src={ user.photo } alt="" />
                        </IconButton>
                    </div>
                </div>
            )
        });
    }

    render() {
        return(
            <div className="users-panel">
                { this._renderUsers() }
            </div>  
        );
    }
}

const mapStateToProps = ({ users }, ownProps) => {
    return {
        users
    }
}

UsersRightSide.propTypes = {
    users: PropTypes.array
}

export default connect(mapStateToProps, null)(UsersRightSide);
