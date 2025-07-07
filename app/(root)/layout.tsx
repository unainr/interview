import MainHeader from '@/components/home/module/ui/Navbar'
import { LayoutProps } from '@/types'
import React from 'react'
const Layout = ({children}:LayoutProps) => {
  return (
    <>
    <MainHeader/>
    {children}
    </>
  )
}

export default Layout