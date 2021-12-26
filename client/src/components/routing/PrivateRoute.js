import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  //if (loading) return <Spinner />;
  if (!isAuthenticated && !loading) {
    return <Navigate to='/login' />;
  }
  return <Component />;
};
// (
//   <Routes>
//     <Route
//       {...rest}
//       render={(props) =>
//         !isAuthenticated && !loading ? (
//           <Navigate to='/login' />
//         ) : (
//           <Component {...props} />
//         )
//       }
//     />
//   </Routes>
// );
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
