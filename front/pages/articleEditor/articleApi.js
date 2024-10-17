import axios from 'axios'

const API_BASE_URL = 'http://localhost:3005/api/article'

let articles = []

const api = {
  // 取得所有文章
  getAllArticles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`)
      articles = response.data
      return articles
    } catch (error) {
      console.error('無法獲取文章:', error.message)
      throw error
    }
  },
  // 搜尋
  searchArticles: async (keyword) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/search?keyword=${keyword}`
      )
      articles = response.data
      return articles
    } catch (error) {
      console.error(`無法使用關鍵字 "${keyword}" 搜索文章:`, error.message)
      throw error
    }
  },
  // 根據文章ID取得文章內容
  getArticle: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error(`無法獲取文章 ${id}:`, error.message)
      throw error
    }
  },
  // 新增文章
  publishArticle: async (articleData) => {
    console.log(articleData)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/publish`,
        articleData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      console.log('伺服器回應:', response.data)
      return response.data
    } catch (error) {
      console.error('無法創建文章:', error)
      if (error.response) {
        console.error('回應狀態:', error.response.status)
        console.error('回應資料:', error.response.data)
      } else if (error.request) {
        console.error('未收到伺服器回應:', error.request)
      } else {
        console.error('錯誤詳細資訊:', error.message)
      }
      throw error
    }
  },
  // 更新文章
  updateArticle: async (id, articleData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${id}/edit`,
        articleData
      )
      console.log(response)
      const updatedArticle = response.data.article

      return updatedArticle
    } catch (error) {
      console.error(`無法更新文章 ${id}:`, error.message)
      throw error
    }
  },
  // 刪除文章
  deleteArticle: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`)

      if (response.status === 200 || response.status === 204) {
        return true
      } else {
        console.error(`無法刪除文章 ${id}:`, response.statusText)
        return false
      }
    } catch (error) {
      console.error(`無法刪除文章 ${id}:`, error.message)
      throw error
    }
  },
  // 取得用戶資料
  getUserById: async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/user/${userId}`
      )
      return response.data
    } catch (error) {
      console.error(`無法獲取用戶 ${userId}:`, error.message)
      throw error
    }
  },
  // 取得留言
  getComments: async (articleId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/${articleId}`)
      return response.data
    } catch (error) {
      console.error(`無法獲取文章 ${articleId} 的留言:`, error.message)
      throw error
    }
  },
  // 新增留言
  addComment: async (articleId, userId, content) => {
    console.log('內容:', content, '用戶ID:', userId)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${articleId}/comments`,
        { userId, content },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('無法添加留言:', error.message)
      throw error
    }
  },
  // 刪除留言
  deleteComment: async (commentId, userId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/comments/${commentId}`,
        {
          params: { userId },
        }
      )
      if (response.status === 200 || response.status === 204) {
        return true
      } else {
        console.error(`無法刪除留言 ${commentId}:`, response.statusText)
        return false
      }
    } catch (error) {
      console.error(`無法刪除留言 ${commentId}:`, error.message)
      throw error
    }
  },
  //新增回覆
  addReply: async (commentId, content, userId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/replies`,
        { commentId, content, userId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('無法添加回覆:', error.message)
      throw error
    }
  },
  //刪除回覆
  deleteReply: async (replyId, userId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/replies/${replyId}`,
        {
          params: { userId },
        }
      )
      if (response.status === 200 || response.status === 204) {
        return true
      } else {
        console.error(`無法刪除回覆 ${replyId}:`, response.statusText)
        return false
      }
    } catch (error) {
      console.error(`無法刪除回覆 ${replyId}:`, error.message)
      throw error
    }
  },
  // 按讚
  toggleLike: async (user_id, target_type, target_id) => {
    console.log({ user_id, target_type, target_id })
    try {
      const response = await axios.post(
        `${API_BASE_URL}/likes`,
        { user_id, target_type, target_id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error(
        `無法切換 ${target_type} ${target_id} 的喜歡狀態:`,
        error.message
      )
      throw error
    }
  },
  // 取得文章的收藏數
  getArticleLikes: async (articleId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${articleId}/likes`)
      return response.data
    } catch (error) {
      console.error(`無法獲取文章 ${articleId} 的喜歡數:`, error.message)
      throw error
    }
  },
  // 用戶是否已收藏文章
  checkUserLikeStatus: async (articleId, userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${articleId}/like-status`,
        {
          params: { userId },
        }
      )
      return response.data
    } catch (error) {
      console.error(`無法檢查文章 ${articleId} 的用戶喜歡狀態:`, error.message)
      throw error
    }
  },
}

export default api
