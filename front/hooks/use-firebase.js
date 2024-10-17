import { initializeApp } from 'firebase/app'

import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth'
import { useEffect } from 'react'

import { firebaseConfig } from './firebase-config'

import jwb from 'jsonwebtoken'

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
 *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
 */
// 重定向專用，用於在同頁面(firebase的登入頁會與回調頁同一頁)監聽登入情況
// getRedirectResult回調頁時用(註:重定向後，回調回來時才會呼叫)
// onAuthStateChanged監聽auth物件變化 <---(用這個就足夠，它會在頁面一啟動偵測目前登入情況)
const initApp = (callback) => {
  // 獲取 Firebase 認證實例
  const auth = getAuth()

  // 處理從重定向認證流中獲取的結果(通常不會經過)
  getRedirectResult(auth)
    .then((result) => {
      // 當 result 存在時，表示認證已經完成
      if (result) {
        // 從結果中獲取 Google 認證憑證
        const credential = GoogleAuthProvider.credentialFromResult(result)
        // 獲取存取令牌 (Access Token)
        const token = credential.accessToken
        // 獲取簽署用戶的資訊
        const user = result.user
        // 輸出存取令牌和用戶資訊到控制台
        // console.log('initApp 拿到的: ', token)
        // console.log('initApp 拿到的: ', user)
      }
    })
    .catch((error) => {
      // 如果處理結果時發生錯誤，輸出錯誤資訊到控制台
      console.error(error)
    })

  // 註冊用戶身份狀態變化的監聽器
  onAuthStateChanged(auth, (user) => {
    // 當用戶登入時，user 參數會包含用戶資訊
    if (user) {
      // console.log('user', user)
      // let TokenData = jwb.decode(user.accessToken)
      // console.log('打開來的資訊: ', TokenData)

      // 調用 callback 函數並傳遞用戶的提供者資料 (providerData) 給它
      callback(user.providerData[0])
    }
  })
}

// TODO: 目前不需要從firebase登出，firebase登出並不會登出google
const logoutFirebase = () => {
  // 取得當前的 Firebase Authentication 物件
  const auth = getAuth()

  // 呼叫 signOut 函數來登出當前使用者
  signOut(auth)
    .then(function () {
      // 如果登出成功，執行這段程式碼
      console.log('成功登出') // 在控制台顯示成功訊息

      // 如果需要，您可以重新導向使用者到 Google 登出頁面，以確保完整地登出 Google 帳戶
      // window.location.assign('https://accounts.google.com/logout')
    })
    .catch(function (error) {
      // 如果登出過程中發生錯誤，執行這段程式碼
      console.log(error) // 在控制台顯示錯誤訊息
    })

  // 這裡提供另一種方式來處理登出事件，將 logoutFirebase 包裝到一個處理函數中
  // const handleLogout = () => {
  //   logoutFirebase() // 在這裡呼叫 logoutFirebase 函數來登出
  // }
}

// 登入
const loginGoogle = async (callback) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  signInWithPopup(auth, provider)
    .then(async (result) => {
      let user = result.user.accessToken // 登入時的資料
      // const user = {
      //   GToken: result.user.accessToken, // 取出登入時的token
      //   Guuid: result.user.uid, // 取出 uid (不知有何用)
      // }
      // localStorage.setItem('GoogleToken', user)z
      console.log(user)
      callback(user) // 傳回去給 google 登入組件

      // // user後端寫入資料庫等等的操作
      // callback(user.providerData[0])
    })
    .catch((error) => {
      console.log(error)
    })
}

const loginGoogleRedirect = async (callback) => {
  const provider = new GoogleAuthProvider()
  // const auth = getAuth()

  // redirect to google auth
  // signInWithRedirect(auth, provider)
}

// TODO: fb有許多前置設定需求，有需要使用請連絡Eddy
const loginFBRedirect = () => {
  const provider = new FacebookAuthProvider()
  // const auth = getAuth()

  // signInWithRedirect(auth, provider)
}

export default function useFirebase() {
  useEffect(() => {
    // 初始化
    initializeApp(firebaseConfig)
  }, [])

  return {
    loginFBRedirect,
    initApp,
    loginGoogleRedirect,
    loginGoogle,
    logoutFirebase,
  }
}
