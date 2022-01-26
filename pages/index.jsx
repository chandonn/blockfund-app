import React, { Component } from 'react'
import factory from '../ethereum/factory'
import { Card, Button } from 'semantic-ui-react'
import Layout from '../components/Layout'

class CampaignList extends Component {
  state = {
    campaigns: []
  }
  
  async componentDidMount() {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    this.setState({ campaigns })
  }

  renderCampaignList() {
    const items = this.state.campaigns.map(i => ({
      header: i,
      description: <a href='#'>Link to campaign</a>,
      fluid: true
    }))

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h2>Open campaigns</h2>
        <Button floated='right' content="Create new campaign" icon="add circle" primary/>
        <div>{this.renderCampaignList()}</div>
      </Layout>
    )
  }
}

export default CampaignList
