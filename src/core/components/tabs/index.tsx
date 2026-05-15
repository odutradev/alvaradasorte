import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material'
import { SyntheticEvent, useState } from 'react'

import { ContentContainer, TabsContainer } from './styles'

import type { TabsProps } from './types'

const Tabs = ({ defaultTab = 0, items }: TabsProps) => {
  const [currentTab, setCurrentTab] = useState(defaultTab)

  const visibleItems = items.filter((item) => item.isVisible !== false)

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  if (!visibleItems.length) return null

  const activeIndex = currentTab >= visibleItems.length ? 0 : currentTab
  const activeContent = visibleItems[activeIndex]?.content

  return (
    <>
      <TabsContainer>
        <MuiTabs onChange={handleTabChange} value={activeIndex} variant="fullWidth">
          {visibleItems.map((item) => (
            <MuiTab label={item.label} key={item.label} />
          ))}
        </MuiTabs>
      </TabsContainer>
      <ContentContainer>
        {activeContent}
      </ContentContainer>
    </>
  )
}

export default Tabs