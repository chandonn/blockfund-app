import React, { Component } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import Layout from '../../components/Layout'
import { Router } from '../../routes'

class CampaignsNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  }

  onSubmit = async () => {
    this.setState({ loading: true })
    this.setState({ errorMessage: '' })

    try {
      const accounts = await web3.eth.getAccounts()
  
      await factory.methods.createCampaign(this.state.minimumContribution).send({
        from: accounts[0]
      })

      Router.pushRoute('/')

    } catch(e) {
      this.setState({ errorMessage: e.message })
    }

    this.setState({ loading: false })
  }

  render() {
    return (
      <Layout>
        <h3>Create a new campaign to your project!</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>The minimum contribution for the campaign</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={e => this.setState({ minimumContribution: e.target.value })}
            />

            <Message error header="The transaction was not completed" content={this.state.errorMessage} />

          </Form.Field>
          
          <Button loading={this.state.loading} primary>Create</Button>
        </Form>
      </Layout>
    )
  }
}

export default CampaignsNew
