// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { isRegistered } from 'services/self'

// mobx
import { observer } from 'mobx-react'

// fragments
import { fragments } from 'services/get-fragments'

// semantic-ui
import { Container } from 'semantic-ui-react'

export default observer(() => (
  <Container style={{ padding: '40px' }}>
    {isRegistered() ? (<fragments.LearnNorm.jsx />): "Please Login"}
  </Container>
))
