import React, { Component } from 'React';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default (WrappedComponent) => {

    class RequireAuth extends Component {

        static defaultProps = {
            authenticated: false
        }

        constructor(props) {
            super(props);
        }

        render() {
            if (this.props.authenticated === false && !this.props.location.pathname.startsWith('/app/signin')) {
                return(
                    <Redirect to={{ pathname: `/app/signin${ this.props.location.search }` }} />
                )
            }
			if (this.props.authenticated && this.props.location.pathname.startsWith('/app/signin')) {
				return(
					<Redirect to={{ pathname: `/app/welcome${ this.props.location.search }` }}/>
				);
            }     
            return(
                <div>
                    <WrappedComponent />
                </div>
            )
        }
    }

    RequireAuth.propTypes = {
        authenticated: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object
        ]),
    }

    const mapStateToProps = ({ authenticated }, ownProps) => {
        return {
            authenticated
        }
    }

    return connect(mapStateToProps)(RequireAuth);
}
