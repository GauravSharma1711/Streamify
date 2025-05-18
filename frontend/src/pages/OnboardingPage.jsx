import React from 'react'

import useAuthUser from '../hooks/useAuthUser.js'


const OnboardingPage = () => {
  const {isLoading,authUser} = useAuthUser()
  return (
    <div>OnboardingPage</div>
  )
}

export default OnboardingPage