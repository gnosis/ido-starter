import React from 'react'
import styled from 'styled-components'

import { Icon, IconTypes } from '@gnosis.pm/safe-react-components'
import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'

interface Props {
  icon?: IconTypes
  iconColor?: ThemeColors
  tooltipText: string
}

const Wrapper = styled.div`
  margin-left: 5px;
`

export const IconTooltip = ({ icon = 'question', iconColor = 'primary', tooltipText }: Props) => {
  return (
    <Wrapper>
      <Icon color={iconColor} size="md" tooltip={tooltipText} type={icon} />
    </Wrapper>
  )
}
