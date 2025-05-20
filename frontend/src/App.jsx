import React from 'react'
import {Navigate, Route,Routes} from 'react-router'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import NotificationsPage from './pages/NotificationsPage'
import OnboardingPage from './pages/OnboardingPage'

import Layout from './components/Layout.jsx'

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
(
  <Layout showSidebar={true}>
     <HomePage/>
   </Layout>
)   : (  

  <Navigate to={'/login'}/> 

) }/>





<Route path='/signup' element={
  !isAuthenticated ?  <SignUpPage/> :
   <Navigate to={ isOnboarded ? '/':'/onboarding'}/>}/>



<Route path='/login' element= {
  !isAuthenticated  ? <LoginPage/> :
   <Navigate to={ isOnboarded ? "/" : "/onboarding" } /> }/>



<Route path='/notifications' 

element={
  isAuthenticated && isOnboarded ? (
    <Layout showSidebar={true}>
      <NotificationsPage/>
    </Layout>
  ) : (
    <Navigate to={!isAuthenticated ? "/login" : "/onboarding" } />
  ) }

/>




<Route path='/call/:id' element={

      isAuthenticated && isOnboarded ?(
        <CallPage/>
      ):(
        <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
      )
   }
 />



<Route path='/chat/:id' element={
  isAuthenticated && isOnboarded ? (
    <Layout showSidebar={false}>
      <ChatPage/>
    </Layout>
  ) :(
    <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
  )  
 } />

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