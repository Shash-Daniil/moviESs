import React from 'react';
import './Tabs.css';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { SEARCH, RATED } from '../../const_strings';

const Tabs = (props) => {
  const { current } = props;

  return (
    <div className="tabs">
      <Menu defaultSelectedKeys={current} onClick={(event) => props.onSetCurrent(event.key)} mode="horizontal">
        <Menu.Item key={SEARCH}>Search</Menu.Item>
        <Menu.Item key={RATED}>Rated</Menu.Item>
      </Menu>
    </div>
  );
};

Tabs.propTypes = {
  current: PropTypes.string.isRequired,
  onSetCurrent: PropTypes.func.isRequired,
};

export default Tabs;
