import { RootWrapper, MainContent } from './styles'
import GridBackground from '@components/gridBackground'
import Header from '@components/header'

import type { PageContainerProps } from './types'

const PageContainer = ({
  children,
  fullHeight = false,
  contentSx
}: PageContainerProps) => {
  return (
    <GridBackground>
      <RootWrapper fullHeight={fullHeight}>
        <Header />
        <MainContent fullHeight={fullHeight} sx={contentSx}>
          {children}
        </MainContent>
      </RootWrapper>
    </GridBackground>
  )
}

export default PageContainer
