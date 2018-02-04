import React from 'react';
import Utils from '../../../utils';
export default (props) => {
    if (!props.message || !props.message.type) {
        return <noscript key={Utils.uid()} />;
    }
    return(
        <div className="message-user-activity">
            <div className="user-activity">
                <img className="user-photo" src={props.message.photo} style={{ marginRight: '20px' }} />
                <div className="user-name">{ props.message.name } {props.txt}.</div>
                <div className="clearfix"></div>            
            </div>
        </div>
    )
}