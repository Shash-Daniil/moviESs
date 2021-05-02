import React, { useState } from 'react'


import { Menu } from 'antd';

const Tabs = props => {
    return (
        <div className="tabs">
            <Menu defaultSelectedKeys={props.current}
                  onClick={(event) => props.onSetCurrent(event.key)}
                  mode="horizontal">
                <Menu.Item key="search">
                    Search
                </Menu.Item>
                <Menu.Item key="rated">
                    Rated
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default Tabs