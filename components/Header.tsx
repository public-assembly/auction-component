import dynamic from 'next/dynamic'

const Connect = dynamic(() => import('./elements/auth/Connect'), {
  ssr: false,
})

import { Navigation } from './Navigation'

export function Header() {

  return (
    <header className="flex flex-col justify-center items-center mb-10 md:flex-row md:justify-center md:items-center w-full px-6 gap-2">
      <Navigation />
      <div className="fixed top-4 right-4">
        <Connect /> 
      </div>
    </header>
  )
}
