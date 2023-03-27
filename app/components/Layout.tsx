import type { FC } from 'react'
import { Footer } from './layout/Footer'
import { Main } from './layout/Main'
import { Navbar } from './layout/Navbar'
import { PageWrapper } from './layout/PageWrapper'

export const Layout:FC = ({children}) => {
  return (
    <PageWrapper>
      <Navbar />
      <Main>
        {children}
      </Main>
      <Footer />
    </PageWrapper>
  )
}
