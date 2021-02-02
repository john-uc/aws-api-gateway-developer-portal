// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'

// semantic-ui
import { Button, Header, Image, Container } from 'semantic-ui-react'

// markdown for external docs description
import Markdown from 'react-markdown/with-html'

// import html-react-parser
import parser from 'html-react-parser'

// services
import { subscribe, unsubscribe } from 'services/api-catalog'
import { isAuthenticated } from 'services/self'

import { GetSdkButton } from 'components/GetSdk'

// state
import { observer, Observer } from 'mobx-react'
import { store } from 'services/state.js'

// Create the plugin that provides our layout component
export const SwaggerLayoutPlugin = () => ({ components: { InfoContainer: InfoReplacement } })

// replaces the InfoContainer component
// https://github.com/swagger-api/swagger-ui/blob/dd3afdc45656bda2a64ae6a7f9bdad006ea98149/src/core/components/layouts/base.jsx

// Note: this is called not as a component, but as a function within a class component. Do
// *not* make this a component, and do *not* use hooks or anything similar in it.
function InfoReplacement ({ specSelectors }) {
  let endpoint
  if (specSelectors.hasHost()) {
    endpoint = `https://${specSelectors.host()}${specSelectors.basePath() || ''}`
  } else {
    const servers = specSelectors.servers()
    if (servers && servers.size) endpoint = servers.getIn([0, 'url'])
  }

  const info = specSelectors.info()
  const version = specSelectors.version()
  const externalDocs = specSelectors.externalDocs()
  const isNormAPI = (store.api.swagger.info.title == "UniCourt Norm APIs")
  const apiTitle = info.get('title')
  const apiDescription = info.get('description')
  const docsDescription = externalDocs.get('description')
  const docsUrl = externalDocs.get('url')

  return <Observer>
    {/*
      If no API is loaded, let's just swallow the state and move on. (Swagger UI doesn't offer any
      way to clean up after itself.)
    */}
    {() => store.api == null ? null : <Container fluid textAlign='left' className='fixfloat' style={{ padding: '40px 0px' }}>
      <div style={{ display: 'flex' }}>
        <div>
          <Header as='h1'>{apiTitle}</Header>
          {apiDescription ? <div class="infodescp wrapper"> <pre>{parser(apiDescription)}</pre> </div>: null}
          {externalDocs ? (
            <div style={{ paddingBottom: '1em' }}>
              {docsDescription ? <Markdown source={docsDescription} /> : null}
              <a href={docsUrl}>{docsUrl}</a>
            </div>
          ) : null}
          <SubscriptionButtons />
          {store.api.sdkGeneration && <GetSdkButton />} 
          { isNormAPI ? (<p>To learn more about Norm APIs <a href='/learn-norm'>click here</a> </p>) : <p></p>}
        </div>
      </div>
    </Container>}
  </Observer>
}

const SubscriptionButtons = observer(class SubscriptionButtons extends React.Component {
  render () {
    const { api } = store

    if (!api || !isAuthenticated()) {
      return null
    }

    const apiIsSubscribable = !!(api && api.apiStage && api.usagePlan)

    if (apiIsSubscribable) {
      return (
        api.subscribed ? (
          <p></p>
        ) : (
          subscribe(api.usagePlan.id)
        )
      )
    } else {
      return <Header style={{ marginTop: '0em' }} as='h4' color='grey'>This version of the API is not configured to be subscribable from the portal. Please contact an admin for more details.</Header>
    }
  }
})

export default SwaggerLayoutPlugin
