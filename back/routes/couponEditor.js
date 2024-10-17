import express from 'express'
import connection from '../db.js'
import moment from 'moment/moment.js'
const router = express.Router()

//抓所有優惠券
router.get('/couponItems', (req, res) => {
  const query = ` SELECT * FROM coupon `
  connection.execute(query, (error, results) => {
    if (error) {
      console.error('資料庫查詢錯誤:', error)
      return res.status(500).json({ message: '伺服器錯誤' })
    }

    if (results.length === 0) {
      return res.status(200).json({ message: '找不到資料' })
    }

    res.status(200).json(results)
  })
})

//抓所有使用者的酷碰券
router.get('/selectcoupon', (req, res) => {
  const query = `
SELECT 
    uc.user_id, 
    c.id AS coupon_id, 
    c.name AS coupon_name, 
    c.code AS coupon_code,
    c.value,
    c.type,
    uc.id AS id,
    uc.lastedit_time AS lastedit_time,
    uc.quantity AS coupon_quantity
FROM 
    user_coupon uc
INNER JOIN 
    coupon c 
ON 
    uc.coupon_id = c.id;
`
  connection.execute(query, (error, results) => {
    if (error) {
      console.error('資料庫查詢錯誤:', error)
      return res.status(500).json({ message: '伺服器錯誤' })
    }

    if (results.length === 0) {
      return res.status(200).json({ message: '找不到資料' })
    }

    res.status(200).json(results)
  })
})
router.post('/addCoupon', (req, res) => {
  const { name, code, type, value } = req.body

  const checkQuery = ` INSERT INTO coupon (name, code, type,value) VALUES (?, ?, ?,?) `

  connection.execute(
    checkQuery,
    [name, code, type, value],
    (error, results) => {
      if (error) {
        console.error('資料庫查詢錯誤:', error)
        return res.status(500).json({ message: '伺服器錯誤' })
      }
      res.status(200).json(results)
    }
  )
})
router.get('/getCouponsByType', (req, res) => {
  const type = req.query.type
  const query = `
    SELECT *
    FROM coupon
    WHERE type = ?;
  `

  connection.execute(query, [type], (error, results) => {
    if (error) {
      console.error('資料庫查詢錯誤:', error)
      return res.status(500).json({ message: '伺服器錯誤' })
    }

    res.status(200).json(results)
  })
})
router.delete('/deleteCoupon', async (req, res) => {
  const { id } = req.query

  const query = ` DELETE FROM coupon WHERE id = ? `

  connection.execute(query, [id], (error, results) => {
    if (error) {
      console.error('資料庫查詢錯誤:', error)
      return res.status(500).json({ message: '伺服器錯誤' })
    }

    res.status(200).json(results)
  })
})
router.put('/updateCoupon', async (req, res) => {
  const { name, code, type, value, id } = req.body
  const query = `
    UPDATE coupon
    SET name = ?, code = ? , type = ? , value = ?
    WHERE id= ?
  `
  connection.execute(query, [name, code, type, value, id], (error, results) => {
    if (error) {
      console.error('資料庫查詢錯誤:', error)
      return res.status(500).json({ message: '伺服器錯誤' })
    }

    res.status(200).json({ message: '更新成功', results })
  })
})

router.get('/searchCoupon', async (req, res) => {
  const { query } = req.query
  const sql = `SELECT * FROM user_coupon WHERE user_id= ?`

  connection.execute(sql, [query], (error, results) => {
    if (error) {
      console.error('資料庫查詢錯誤:', error)
      return res.status(500).json({ message: '伺服器錯誤' })
    }

    res.status(200).json({ message: '搜尋成功', results })
  })
})
export default router
