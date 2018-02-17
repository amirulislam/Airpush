import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class BaseAlert extends Component {
    constructor(props) {
        super(props);
        this.state = { open: false, nodes: [] };
    }

    open(nodes) {
        this.setState({ open: true });
        this.setState({ nodes: nodes });
    }

    close() {
        this.setState({ open: false });
        if (this.props.onCancel) {
            this.props.onCancel();
        }         
    }

    handleAccept() {
        this.setState({ open: false });
        if (this.props.onAccept) {
            this.props.onAccept();
        }        
    }

    handleClose() {
        this.setState({ open: false });
        if (this.props.onCancel) {
            this.props.onCancel();
        } 
    }    

    _getActions() {
        let actions = [];
        if (this.props.onAccept) {
            actions.push(<FlatButton label="OK" primary={true} onClick={() => this.handleAccept()}/>)
        }
        if (this.props.onCancel && !this.props.hideCancelButton) {
            actions.push(<FlatButton label="Cancel" primary={false} onClick={() => this.handleClose()}/>)
        }        
        return actions;
    }

    _renderContentStyle() {
        if (this.props.maxWidth) {
            return { maxWidth: this.props.maxWidth }
        }
        return {};
    }

    _renderTitle() {
        if (this.props.title) {
            return <div className="title">{this.props.title}</div>
        }        
    }

    render() {
        return(
            <Dialog contentStyle={this._renderContentStyle()}
            modal={false}
            open={this.state.open}
            onRequestClose={() => this.handleClose()}
            >
                <div className="base-alert-content">
                    { this._renderTitle() }
                    <div className="content">{ this.state.nodes }</div>
                    <div className="button-actions">{this._getActions()}</div>
                </div>
            </Dialog>
        );
    }
}
export default BaseAlert;
