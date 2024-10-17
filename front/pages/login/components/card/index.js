import React, { useState, useEffect, useContext } from 'react'
import styles from './assets/style/style.module.scss'
import bg from './assets/img/bg.png'
import axios from 'axios'
import { useRouter, Link } from 'next/router' // 切換路由
import { FaGooglePlus } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import jwt from 'jsonwebtoken'
import { AuthContext } from '@/context/AuthContext'
import Swal from 'sweetalert2'
import { MdOutlineMail } from 'react-icons/md'

import Google_btn from '../google_btn'
import Loading from '@/components/Loading'

import { FaCircleCheck } from 'react-icons/fa6' // email 過關勾勾

// material
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

export default function Card() {
  const [isLoginSlideUp, setIsLoginSlideUp] = useState(false)
  const [isSignupSlideUp, setIsSignupSlideUp] = useState(true)
  const [retrieve, setRetrieve] = useState(null) //擷取登入錯誤時的部份訊息
  const [forget_password, setforget_password] = useState(false) //擷取登入錯誤時的部份訊息

  const [loading, setLoading] = useState(false) // 點擊直到切換的過渡

  const [err, setErr] = useState(0) // 錯誤次數

  const router = useRouter() // 初始化router

  const [loginInfo, setLoginInfo] = useState({ account: '', password: '' }) // 登入訊息
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    account: '',
    password: '',
    email: ' ',
  }) // 註冊訊息

  // context
  const { setUser } = useContext(AuthContext)

  const loginApi = 'http://localhost:3005/api/user/login' // 登入系統 API
  // const loginApi = 'http://localhost:3005/api/login' // 登入系統 API
  const signupApi = 'http://localhost:3005/api/user/register' // 註冊系統 API

  // 切換登入
  const LoginClick = () => {
    setIsLoginSlideUp(false)
    setIsSignupSlideUp(true)
  }

  // 切換註冊
  const SignupClick = () => {
    setIsLoginSlideUp(true)
    setIsSignupSlideUp(false)
  }

  // 把輸入的值輸出
  const Input_change = (event) => {
    // 從事件對象中提取 name 和 value 屬性
    const { name, value } = event.target

    // 根據當前狀態來決定是處理登入還是註冊
    if (isLoginSlideUp) {
      // 如果當前狀態是註冊 (isLoginSlideUp 為 true)
      // 使用函數式更新來更新 signupInfo 狀態
      setSignupInfo((prevState) => ({
        ...prevState, // 保留之前的狀態
        [name]: value, // 更新當前輸入字段的值
      }))
    } else {
      // 如果當前狀態是登入 (isLoginSlideUp 為 false)
      // 使用函數式更新來更新 loginInfo 狀態
      setLoginInfo((prevState) => ({
        ...prevState, // 保留之前的狀態
        [name]: value, // 更新當前輸入字段的值
      }))
    }
  }

  // 開始登入 或 註冊
  const handleSubmit = (event) => {
    event.preventDefault()

    const api = isLoginSlideUp ? signupApi : loginApi //要帶入"登入"還是"註冊"的 API
    const data = isLoginSlideUp ? signupInfo : loginInfo //要帶入"登入"還是"註冊"的資料

    axios
      .post(api, data)
      .then((res) => {
        if (res.status === 200 && res.data.status === 'success') {
          // 從響應中獲取 token
          const token = res.data.token
          console.log('dfgtyhuj ', token)
          localStorage.setItem('TheToken', token)

          if (token) {
            // 檢查 token 是否有效
            // console.log("我的亂碼:",token);
            let result = jwt.decode(token)
            // console.log("我的 result ",result );
            if (result.account) {
              // console.log("有效", result);
              // 如果 token 有效，設置使用者資訊
              setUser(result)
              // console.log("數據 ", user);
            } else {
              // console.log("無效 ",result);
              setUser(undefined)
            }
          }

          setErr(0) //登入錯誤次數歸零
          console.log('登入成功 token : ', token)
          // router.push('http://localhost:3000/IGotBrew')
          switch_router()
          // 這裡可以進行 token 的存儲或其他操作
        } else if (res.data.message === '註冊成功') {
          console.log('回傳: ', res.data.message)

          Swal.fire({
            icon: 'success',
            title: '註冊成功',
            confirmButtonText: '確定',
          }).then((result) => {
            if (result.isConfirmed) {
              // router.push('http://localhost:3000/IGotBrew')
            }
          })

          setSignupInfo({
            name: '',
            account: '',
            password: '',
            email: ' ',
          })
          location.reload()
        } else if (res.data.err === '登入錯誤') {
          setRetrieve(res.data.message)
          throw new Error(res.data.message.name)
        }
      })
      .catch((error) => {
        if (error.response.data.message === '密碼錯誤') {
          Swal.fire({
            icon: 'error',
            title: '密碼錯誤',
            showConfirmButton: false,
            timer: 1500,
          })
          setErr(err + 1) //登入次數錯誤累加
          setforget_password(true)
        }
        console.log('回傳錯誤', error.response.data.data)
        setRetrieve(error.response.data)
      })
  }

  // 登入失敗次數
  if (err >= 3) {
    alert('您失敗了, 請確認後再試')
    router.push('http://localhost:3000/IGotBrew')
  }

  // 登入跳轉
  const switch_router = async () => {
    setLoading(true)
    await router.push('http://localhost:3000/IGotBrew')
    setLoading(false)
  }

  // 寄信: 忘記密碼
  const recover = () => {
    let data = retrieve.data
    console.log('忘記密碼: ', data)

    Swal.fire({
      icon: 'error',
      title: `${data.name} 忘記密碼?`,
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonText: '是的', // 確認按鈕文字
      cancelButtonText: '沒有', // 取消按鈕文字
      reverseButtons: true, // 確認與取消按鈕交換位置（讓確認在右邊）
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('使用者按下確認')

        Swal.fire({
          icon: 'success', // 顯示成功圖示
          title: '信件已送出！', // 標題改為信件送出
          text: '請檢查您的信箱以完成下一步。', // 額外說明文字
          // showConfirmButton: true, // 顯示確認按鈕
          // confirmButtonText: '確認', // 確認按鈕文字
        })

        const api = 'http://localhost:3005/user/email'
        axios
          .post(api, data)
          .then((res) => {
            console.log(res.data)
          })
          .catch((err) => {
            console.log('錯誤 ', err)
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 使用者按下取消按鈕時的處理
        console.log('使用者按下取消')
      }
    })
  }

  return (
    <div
      className={`${styles['login-box']} mx-3 mt-5`}
      style={{
        maxWidth: '400px',
        height: '600px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className={`${styles['form-structor']}`}>
        {/* Signup */}
        <form onSubmit={handleSubmit}>
          <div
            className={`${styles.signup} ${
              isSignupSlideUp ? styles['slide-up'] : ''
            } `}
            onClick={SignupClick}
          >
            <h2
              className={`${styles['form-title']} text-dark`}
              id="signup"
              style={{ fontSize: '3rem' }}
            >
              註冊
            </h2>
            {/* bg-transparent 可以把 input 分開 */}
            <div className={`${styles['form-holder']}  `}>
              <input
                name="name"
                type="text"
                className={`${styles.input} mb-3 fs-3`}
                style={{ height: '50px' }}
                placeholder="名字"
                value={isLoginSlideUp ? signupInfo.name : loginInfo.name}
                onChange={Input_change}
              />

              <input
                name="account"
                type="text"
                className={`${styles.input} mb-3 fs-3`}
                style={{ height: '50px' }}
                placeholder="帳號"
                value={isLoginSlideUp ? signupInfo.account : loginInfo.account}
                onChange={Input_change}
              />

              <input
                name="password"
                type="password"
                className={`${styles.input} mb-2 fs-3`}
                style={{ height: '50px' }}
                placeholder="密碼"
                value={
                  isLoginSlideUp ? signupInfo.password : loginInfo.password
                }
                onChange={Input_change}
              />

              {/* <input
                name="phone"
                type="text"
                className={`${styles.input} mb-2 fs-3`}
                style={{ height: '50px' }}
                placeholder="電話"
                value={isLoginSlideUp ? signupInfo.phone : loginInfo.phone}
                onChange={Input_change}
              /> */}

              <div>
                <input
                  name="email"
                  type="email"
                  className={`${styles.input} mb-2 fs-3`}
                  style={{ height: '50px' }}
                  placeholder="電子信箱 (請輸入電子信箱)"
                  value={isLoginSlideUp ? signupInfo.email : loginInfo.email}
                  onChange={Input_change}
                />
              </div>
            </div>
            {retrieve ? (
              <p className="fs-5 text-danger">輸入錯誤: {retrieve.message}</p>
            ) : (
              <p className="fs-5"></p>
            )}

            <button type="submit" className={styles['submit-btn']}>
            Register 註冊
            </button>

            {/* 一鍵輸入 */}
            <button
            className={`${styles['speed']}`}
              type="button"
              onClick={() =>
                setSignupInfo({
                  name: '張雨涵',
                  account: 'gotbrew666',
                  password: '111111', // 6個1
                  email: 'harry08270712@gmail.com',
                })
              }
             
            >
              新註冊會員
            </button>
          </div>
        </form>

        {/* Login */}
        <form onSubmit={handleSubmit}>
          <div
            className={`${styles.login} ${
              isLoginSlideUp ? styles['slide-up'] : ''
            }`}
            onClick={LoginClick}
          >
            <div className={`${styles['center']}`}>
              <h2
                className={`${styles['form-title']} text-white mt-3`}
                id="login"
                style={{ fontSize: '3rem' }}
              >
                登入
              </h2>
              <div className={styles['form-holder']}>
                <input
                  name="account"
                  type="text"
                  className={`${styles.input} mb-3 fs-3`}
                  style={{ height: '50px' }}
                  placeholder="帳號"
                  value={loginInfo.account}
                  onChange={Input_change}
                />

                <input
                  name="password"
                  type="password"
                  className={`${styles.input} mb-2 fs-3`}
                  style={{ height: '50px' }}
                  placeholder="密碼"
                  value={loginInfo.password}
                  onChange={Input_change}
                />
              </div>

              <p className="text-white fs-5 mb-5">
                登入錯誤次數: <span>{err}</span>
              </p>

              <button type="submit" className={styles['submit-btn']}>
                Login 登入
              </button>

              {forget_password ? (
                <div className="w-100 d-flex justify-content-end">
                  <span
                    onClick={(e) => {
                      recover(e)
                    }}
                    className="text-end  me-3 fs-4 text-white"
                    style={{ cursor: 'pointer' }}
                  >
                    忘記密碼
                  </span>
                </div>
              ) : null}

              <div style={{ zIndex: 3 }}>
                {/* <hr className="Light " /> */}
                <p className="text-center mt-3 fs-5 text-white-50">
                  <span className="text-secondary">
                    <span className="d-none d-md-inline">––</span>
                    –––––––{''}
                  </span>
                  {''} 或是嘗試其他登入方式 {''}
                  <span className="text-secondary">
                    <span className="d-none d-md-inline">––</span>
                    –––––––{''}
                  </span>
                </p>
                <span className="p-3">
                  <Google_btn />
                </span>

                {/* 信箱登入 */}
                {/* <span
                  className="py-3 pb-4 px-2 ms-2"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: '2px solid #6b92a4',
                    borderRadius: '10px',
                  }}
                >
                  <MdOutlineMail size={30} color="White" />
                </span> */}
              </div>

              {/* 一建登入 */}
              <div className="mt-5 p-2" style={{ position: 'absolute' }}>
                <button
                  className={`${styles['speed']}`}
                  type="button"
                  onClick={() =>
                    setLoginInfo({ account: 'gotbrew666', password: '111111' })
                  }
                >
                  新註冊會員
                </button>
                <button
                  className={`${styles['speed']}`}
                  type="button"
                  onClick={() =>
                    setLoginInfo({ account: 'zhang5678', password: '111111' })
                  }
                >
                  一般使用者
                </button>
                <button
                className={`${styles['speed']} `}
                  
                  type="button"
                  onClick={() =>
                    setLoginInfo({ account: 'bai56789', password: 'pass234' })
                  }
                >
                  管理員
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
