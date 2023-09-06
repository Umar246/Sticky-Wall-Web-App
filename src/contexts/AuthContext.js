import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'


export const AuthContext = createContext()
export default function AuthContextProvider(props) {
const [user,setUser] = useState ({})
const [isAuthenticated ,setIsAuthenticated] = useState (false)

useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
         setUser(user)
         setIsAuthenticated(true)
        } else {
         console.log('User not Found')
        }
      });
},[])


  return (
   <AuthContext.Provider value={{user,isAuthenticated,setIsAuthenticated}}>
    {props.children}
   </AuthContext.Provider>
  )
}


 export  const useAuthContext = () => useContext(AuthContext)