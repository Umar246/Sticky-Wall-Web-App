import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { auth } from '../../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { LuMail } from "react-icons/lu";
import { BiLock } from "react-icons/bi";

const initialState = { email: '', password: '' }
export default function Login() {
  const navigate = useNavigate()

  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = e => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleLogin = e => {
    e.preventDefault()
    let { email, password } = state

    setIsProcessing(true)

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let user = userCredential.user
        console.log(user)
        message.success('User loged in successfully')
        navigate('/')
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsProcessing(false)

      })

  }

  return (
    <div className="auth">
      <div className="container">
        <div className="row">
          {/* <h1>{[user.firstname]}</h1> */}
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
            <div className="card p-2 p-md-3 p-lg-4">
              {/* Headeing */}
              <div className="row mb-4">
                <div className="col">
                  <h3>LOGIN</h3>
                </div>
              </div>
              <form onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="email" className='mb-1 ms-1'>Email</label>
                    <Input size="large" onChange={handleChange} name='email' placeholder="Email" prefix={<LuMail size={18} />} />
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
                        !isProcessing ? "Login"
                          :
                          <div className='spinner-border spinner-border-sm '></div>
                      }
                    </button>
                  </div>
                </div>
              </form>

              <div className="row mt-4">
                <div className="col">
                  <p className='text-center'>Create new account ? <Link to={'/auth/register'} className='btn btn-link'>REGISTER</Link></p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
