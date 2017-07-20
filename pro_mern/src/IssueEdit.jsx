import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const IssueEdit = ({ match }) => (
  <div>
    <p>This is a placeholder for issue edit {match.params.id}</p>
    <Link to="/issues">Back to issues</Link>
  </div>
);

IssueEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IssueEdit;
