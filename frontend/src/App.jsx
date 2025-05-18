import React from 'react'
import {Navigate, Route,Routes} from 'react-router'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import NotificationsPage from './pages/NotificationsPage'
import OnboardingPage from './pages/OnboardingPage'

import  {Toaster}  from 'react-hot-toast'



import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'


export default function App() {

  //TANSTACK QUERY
  //get->useQuery
  // post,put,del->mutation

 const {isLoading , authUser}  = useAuthUser();
  
 const isAuthenticated = Boolean(authUser);
 const isOnboarded = authUser?.isOnboarded

if(isLoading) return <PageLoader/>


  return (
    <div className=" h-screen" data-theme="night">
   
   <Routes>

<Route path='/' element={
  isAuthenticated && isOnboarded
?
(<HomePage/>):( <Navigate to={'/login'}/> ) }/>

<Route path='/signup' element={
  !isAuthenticated ?  <SignUpPage/> :
   <Navigate to={ isOnboarded ? '/':<OnboardingPage/>}/>}/>



<Route path='/login' element={!isAuthenticated?<LoginPage/>:<Navigate to={'/'}/>}/>
<Route path='/notification' element={<NotificationsPage/>}/>
<Route path='/call' element={!isAuthenticated?<CallPage/>:<Navigate to={'/'}/>}/>
<Route path='/chat' element={!isAuthenticated?<ChatPage/>:<Navigate to={'/'}/>}/>

<Route path='/onboarding' element={
  isAuthenticated ?
  (
    !isOnboarded?
    (<OnboardingPage/>) : (<Navigate to={'/'}/>)
    
  )   :

  (  <Navigate to={'/'}/>   )
  
  }/>

   </Routes>
         <Toaster/>

    </div>
  )
}