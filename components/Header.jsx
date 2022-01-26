import React from 'react'
import { Menu } from 'semantic-ui-react'

const Header = () => (
  <Menu style={{ marginTop: '2rem' }}>
    <Menu.Item>CrowdCoin</Menu.Item>

    <Menu.Item position='right'>
      <Menu.Item>Campaigns</Menu.Item>
      <Menu.Item>Add +</Menu.Item>
    </Menu.Item>
  </Menu>
)

export default Header