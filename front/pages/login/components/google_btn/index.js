import React, { useState, useEffect, useContext } from 'react'
import { FaGoogle } from 'react-icons/fa'
import axios from 'axios'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import GoogleLogo from '@/components/icons/google-logo'

// google 登入
import useFirebase from '@/hooks/use-firebase'
import { useAuth } from '@/hooks/use-auth'

// 取出當前使用者
import { AuthContext } from '@/context/AuthContext'

// google 登入按鈕
export default function google_btn() {
  const { loginGoogle, initApp, logoutFirebase } = useFirebase()
  const { auth, setAuth } = useAuth()

  const { user, setUser, setToken } = useContext(AuthContext) // 抓使用者資訊

  const router = useRouter() // 初始化router

  useEffect(() => {
    initApp((providerData) => {
      if (providerData) {
        setAuth({ isAuth: true, ...providerData })

        console.log('prov啥的: ', providerData)

        const api = 'http://localhost:3005/user/google'
        axios
          .post(api, providerData)
          .then((res) => {
            let data = res.data[0]
            const api = 'http://localhost:3005/api/user/googleLogin' // google 登入系統 API

            console.log('收編帳號: ', res.data[0]) //轉化成跟原住名同款資料
            /////
            axios
              .post(api, data)
              .then((res) => {
                if (res.status === 200 && res.data.status === 'success') {
                  const token = res.data.token
                  localStorage.setItem('TheToken', token)

                  if (token) {
                    // 檢查 token 是否有效
                    // console.log("我的亂碼:",token);
                    let result = jwt.decode(token)
                    // console.log('我的 result ', result)
                    if (result.email) {
                      console.log('google token 解析: ', result)
                      setUser(result)
                      router.push('http://localhost:3000/IGotBrew')
                    } else {
                      // console.log("無效 ",result);
                      setUser(undefined)
                    }
                  }
                  // console.log('google 回傳前端 token : ', token)
                }
                // console.log('huiop[')
              })
              .catch((error) => {
                console.error(error)
              })

            // setUser(res.data)
            // router.push('http://localhost:3000/IGotBrew')
          })
          .catch((err) => {
            console.log('收編失敗', err)
          })
      } else {
        setAuth({ isAuth: false })
        console.log('登入失敗', providerData)
      }
    })
  }, [auth])

  // 處理google登入後，要向伺服器進行登入動作
  const callbackGoogleLoginPopup = async (providerData) => {
    // console.log('登入組件: ', providerData) //收到的是 token
    const data = jwt.decode(providerData)

    const api = 'http://localhost:3005/user/google'
    axios
      .post(api, data)
      .then((res) => {
        console.log('成功輸入資料庫: ', res.data[0])
        setUser(res.data[0])
        router.push('http://localhost:3000/IGotBrew')
      })
      .catch((err) => {
        console.log('收編失敗', err)
      })

    // setUser(data)

    // console.log('fghujiop[')
  }

  return (
    <>
      {/* <FaGoogle
        size={30}
        color="blue"
        style={{
          cursor: 'pointer',
          backgroundColor: '#ffffff', // 半透明背景顏色
          border: '2px solid black', // 黑色邊框
          borderRadius: '30%', // 圓角
          padding: '5px', // 內距
        }}
      /> */}

      <button
        style={{
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: '2px solid #6b92a4',
          borderRadius: '10px',
        }}
        className="p-1"
        onClick={() => loginGoogle(callbackGoogleLoginPopup)}
      >
        <GoogleLogo />
      </button>
    </>
  )
}
