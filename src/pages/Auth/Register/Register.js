import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, firestore } from '../../../config/firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { Input, message } from 'antd'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { LuMail } from 'react-icons/lu';
import { BiLock } from 'react-icons/bi';
import { useEffect } from 'react'
// import {  AuthContext } from '../../../context/AuthContext'


//_____________________________________________________________________________________________________________________________________

const initialState = { name: '', email: '', password: '' }
export default function Register() {
  // const { dispatch } = useContext(AuthContext)

  //_____________________________________________________________________________________________________________________________________
  // States
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  //_____________________________________________________________________________________________________________________________________

  //HandleChange for inputs
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))


  //_____________________________________________________________________________________________________________________________________

  //Handle Register (Jab register button par click kary gy tou chly ga)

  const handleRegister = e => {
    e.preventDefault()
    let { email, password } = state

    setIsProcessing(true)

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let user = userCredential.user
        // console.log('user', user)
        createProfile(user)
        setIsProcessing(false)
        console.log("user created")
      })
      .catch(err => {
        console.error(err)
        setIsProcessing(false)
      })

  }

  //_____________________________________________________________________________________________________________________________________

  //  addDocument function is ma user firestore ma create ho ga 



  let navigate = useNavigate()

  const createProfile = async (user) => {

    try {

      let { name } = state
      const { email, uid } = user

      const userData = {
        name, email, uid,
        dateCreated: serverTimestamp(),
        status: 'active',
        roles: ['superAdmin']
      }

      await setDoc(doc(firestore, "users", uid), userData);
      console.log("user document created at firestore")
      message.success('A new user has been created successfully ')
      navigate('/')
      // dispatch({ type: "LOGIN" })

    } catch (err) {
      console.error('Something went wrong while creating user ')
      console.error('Error adding document :', err)

    }
  }







  //_____________________________________________________________________________________________________________________________________

  return (
    <div className="auth">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
            <div className="card p-2 p-md-3 p-lg-4">
              {/* Headeing */}
              <div className="row mb-4">
                <div className="col">
                  <h3>REGISTER</h3>
                </div>
              </div>
              <form onSubmit={handleRegister}>

                {/* UserName Input */}
                <div className="row mb-3">
                  <div className="col">
                    <label className='mb-1 ms-1'>Username</label>
                    {/* <input type="text" onChange={handleChange} className='form-control' placeholder='Username' name='name' /> */}

                    <Input size="large" placeholder="Username" name='name' onChange={handleChange} prefix={<UserOutlined size={18} />} />
                  </div>
                </div>

                {/* Email Input */}
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="email" className='mb-1 ms-1'>Email</label>
                    <Input size="large" name='email' onChange={handleChange} placeholder="Email" prefix={<LuMail size={18} />} />
                  </div>
                </div>

                {/* Password Input */}
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="password" className='mb-1 ms-1'>Password</label>
                    <Input.Password

                      size="large"
                      name='password'
                      onChange={handleChange}
                      placeholder="Password"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      prefix={<BiLock size={18} />}
                    />
                  </div>
                </div>



                <div className="row mt-4">
                  <div className="col">
                    <button className='btn w-100' disabled={isProcessing}>
                      {
                        !isProcessing ? "Register"
                          :
                          <div className='spinner-border spinner-border-sm '></div>
                      }
                    </button>
                  </div>
                </div>
              </form>

              <div className="row mt-4">
                <div className="col">
                  <p className='text-center'>Already have an account ? <Link to={'/auth/login'} className='btn btn-link'>LOGIN</Link></p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
