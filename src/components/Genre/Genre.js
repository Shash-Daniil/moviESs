import React from 'react';
import './Genre.css';
import PropTypes from 'prop-types';

const Genre = (props) => {
  const { genre } = props;

  return <span className="genres__item">{genre}</span>;
};

Genre.propTypes = {
  genre: PropTypes.string.isRequired,
};

export default Genre;
