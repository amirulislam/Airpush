import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Modal extends PureComponent {

    constructor(props) {
        super(props);
    }

    onCancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    onAccept(e: any) {
        if (this.props.onAccept) {
            this.props.onAccept(e);
        }
    } 

    render() {
        return(
            <div className="modal-overlay">
                <div className="generic-modal" style={{ width: this.props.wdt }}>
					<div className="modal-header">
						<div className="title">{ this.props.title }</div>
						<div className="underline"></div>
					</div>
					<div className="body">
                        { this.props.children }
					</div>
				</div>
            </div>
        )
    }
}

Modal.defaultProps = {
    title: 'Title',
    wdt: 380
}

Modal.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    title: PropTypes.string,
    wdt: PropTypes.number
}

export default Modal;
