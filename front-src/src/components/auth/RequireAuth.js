import React, { Component } from 'React';
import PropTypes from 'prop-types';

export default (WrappedComponent) => {

    class RequireAuth extends Component {

        static defaultProps = {
            authenticated: false
        }

        constructor(props) {
            super(props);
        }

        render() {
            return(
                <div>
                    content 111
                </div>
            )
        }
    }

    RequireAuth.propTypes = {
        authenticated: PropTypes.bool || PropTypes.object
    }

    const mapStateToProps = ({ authenticated }, ownProps) => {
        return {
            authenticated
        }
    }

    return RequireAuth;
}
