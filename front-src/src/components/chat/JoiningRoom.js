import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { joinRoomNow } from '../../actions';

class JoiningRoom extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.joinRoomNow(this.props.roomToJoin);
    }

    render() {
        return(
            <div className="joining-chatroom">
                <p>Joining room { this.props.roomToJoin } ... </p>
                <div><img src="/assets/img/preloader.gif" alt="" /></div>
            </div>  
        );
    }
}

export default connect(null, { joinRoomNow })(JoiningRoom);
