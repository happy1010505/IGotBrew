import React, { useEffect, useState } from 'react'
import styles from '@/styles/article.module.scss'
import Image from 'next/image'
import api from '@/pages/articleEditor/articleApi'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import newhand from '@/public/images/article/newhand.png'
import oldhand from '@/public/images/article/oldhand.png'
import coffeebean from '@/public/images/article/coffeebean.png'
import coffeemachine from '@/public/images/article/coffeemachine.png'
import tools from '@/public/images/article/tools.png'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

export default function Article() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const [filteredArticles, setFilteredArticles] = useState([])
  const [currentArticles, setCurrentArticles] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const articlesPerPage = 9

  const fetchArticle = async (sortOrder) => {
    try {
      const response = await api.getAllArticles()
      const articles = response.data.articles

      //排序
      const sortedArticles = articles.sort((a, b) => {
        if (sortOrder === 'likes') {
          return b.likes_count - a.likes_count
        } else if (sortOrder === 'asc') {
          return a.id - b.id
        } else {
          return b.id - a.id
        }
      })

      setArticles(sortedArticles)
    } catch (error) {
      console.error('無法獲取文章:', error.message)
    }
  }

  const handleSortChange = (e) => {
    if (e.target.checked) {
      setSortOrder('likes')
    } else {
      setSortOrder('desc')
    }
  }

  const handleTagClick = (tag) => {
    setSelectedTag(tag)
    setCurrentPage(1)
  }

  // 標籤篩選功能
  const getFilterTag = (articles, selectedTag) => {
    if (!selectedTag) return articles

    return articles.filter(
      (article) => article.tag1 === selectedTag || article.tag2 === selectedTag
    )
  }

  //分頁顯示
  const getCurrentPage = (articles, currentPage, articlesPerPage) => {
    const indexOfLastArticle = currentPage * articlesPerPage
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage

    return articles.slice(indexOfFirstArticle, indexOfLastArticle)
  }

  // 計算總頁數
  const getTotalPages = (totalArticles, articlesPerPage) => {
    return Math.ceil(totalArticles / articlesPerPage)
  }

  // 處理頁面跳轉，並將頁面捲動到篩選區域
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)

    const filterElement = document.getElementById('filter')
    if (filterElement) {
      filterElement.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const filteredArticles = getFilterTag(articles, selectedTag)
    const currentArticles = getCurrentPage(
      filteredArticles,
      currentPage,
      articlesPerPage
    )
    const totalPages = getTotalPages(filteredArticles.length, articlesPerPage)

    setFilteredArticles(filteredArticles)
    setCurrentArticles(currentArticles)
    setTotalPages(totalPages)
  }, [articles, selectedTag, currentPage, articlesPerPage])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetchArticle(sortOrder)
  }, [sortOrder])

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className={`${styles['articles-bg']} container-fluid mt-5`}>
        <div className={`${styles['articles']}`}>
          <div className={`${styles['container-title']} container`}>
            <div className={`${styles['title']}`}>
              <p>咖啡專欄</p>
            </div>
            <nav
              aria-label="breadcrumb"
              className={`${styles['article-breadcrumb']}`}
              style={{
                '--bs-breadcrumb-divider': "'>'",
              }}
            >
              <ol className="breadcrumb">
                <li className={`${styles['breadcrumb-item']} breadcrumb-item`}>
                  <Link href="/IGotBrew">首頁</Link>
                </li>
                <li
                  aria-current="page"
                  className={`${styles['breadcrumb-item']} ${styles['active']} breadcrumb-item active`}
                >
                  咖啡專欄
                </li>
              </ol>
            </nav>
          </div>
          <div
            className={`${styles['container']} ${styles['tag-group']} container`}
          >
            <div className={`${styles['row']} row row-cols-md-5 row-cols-lg-5`}>
              <div
                className={`${styles['tag1']} ${styles['tag-fliter']} ${styles['col-6']} col col-6`}
                onClick={() => handleTagClick('新手')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('新手')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={`${styles['tag-col']} col`}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={newhand}
                  />
                  <div className={styles['tag-name']}>
                    <p># 新手</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag2']} ${styles['tag-fliter']} ${styles['col-6']} col col-6`}
                onClick={() => handleTagClick('老手')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('老手')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={oldhand}
                  />
                  <div className={styles['tag-name']}>
                    <p># 老手</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag3']} ${styles['tag-fliter']} ${styles['col']} col col-4`}
                onClick={() => handleTagClick('咖啡豆')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('咖啡豆')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={coffeebean}
                  />
                  <div className={styles['tag-name']}>
                    <p># 咖啡豆</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag4']} ${styles['tag-fliter']} ${styles['col']} col col-4`}
                onClick={() => handleTagClick('咖啡機')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('咖啡機')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={coffeemachine}
                  />
                  <div className={styles['tag-name']}>
                    <p># 咖啡機</p>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['tag5']} ${styles['tag-fliter']} ${styles['col-4']} col col-4`}
                onClick={() => handleTagClick('配件')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTagClick('配件')
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className={styles['tag-col']}>
                  <Image
                    className={`${styles['tag-pic']}`}
                    layout="responsive"
                    alt=""
                    src={tools}
                  />
                  <div className={styles['tag-name']}>
                    <p># 配件</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="filter"
            className={`${styles['total-fliter']} container d-flex`}
          >
            <div className={`${styles['count']}`}>
              <p>共&nbsp;{filteredArticles.length}&nbsp;筆</p>
            </div>
            <div className={`${styles['filter']}`}>
              <div className={`${styles['switch']}`}>
                <input
                  className={`${styles['check-toggle']} ${styles['checkFilter']}`}
                  id="toggle"
                  type="checkbox"
                  onChange={handleSortChange}
                />
                <label htmlFor="toggle" />
                <span className={`${styles['on']}`}>最新知識</span>
                <span className={`${styles['off']}`}>最多按讚</span>
              </div>
            </div>
          </div>

          <div
            className={`${styles['container']} ${styles['card-group']} container`}
          >
            <div
              className={`${styles['row']} ${styles['row-cols-1']} ${styles['row-cols-sm-2']} ${styles['row-cols-md-3']} row row-cols-1 row-cols-sm-2 row-cols-md-3`}
            >
              {currentArticles.map((article) => (
                <div key={article.id} className={`${styles['col']}`}>
                  <div className={`${styles['card']} ${styles['card1']}`}>
                    <div className={styles['card-image']}>
                      {article.image_url && (
                        <Image
                          alt={article.title}
                          width={1000}
                          height={600}
                          className={`${styles['card-image']} img-fluid rounded-start`}
                          src={`http://localhost:3005${article.image_url}`}
                        />
                      )}
                    </div>
                    <div className={`${styles['card-body']}`}>
                      <div className={`${styles['tag-group']}`}>
                        <p className={`${styles['tag']} ${styles['tag1']}`}>
                          {article.tag1}
                        </p>
                        <p className={`${styles['tag']} ${styles['tag2']}`}>
                          {article.tag2}
                        </p>
                      </div>
                      <div className={styles['publish-date']}>
                        {new Date(article.create_time).toLocaleDateString()}
                      </div>
                      <div className={styles['title-group']}>
                        <p className={styles['card-title']}>{article.title}</p>
                        <div className={styles['title-border']} />
                      </div>
                      <p className={styles['card-text']}>
                        {' '}
                        <div
                          dangerouslySetInnerHTML={{ __html: article.content }}
                          className={styles['article-content']}
                        />
                      </p>
                      <div className={styles['btn-box']}>
                        <Link
                          className={styles['btn-more']}
                          href={`/article/${article.id}`}
                        >
                          READ MORE
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles['pagination']} container`}>
            <nav aria-label="Page navigation example">
              <ul
                className={`${styles['pagination']} pagination justify-content-center`}
              >
                <li
                  className={`${styles['page-item']} page-item ${
                    currentPage === 1 ? 'disabled' : ''
                  }`}
                >
                  <button
                    className={`${styles['page-link']} page-link`}
                    onClick={(e) => {
                      e.preventDefault()
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }}
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">
                      <FaAngleLeft />
                    </span>
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`${styles['page-item']} page-item ${
                      currentPage === index + 1 ? styles.active : ''
                    }`}
                  >
                    <button
                      className={`${styles['page-link']} page-link`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`${styles['page-item']} page-item ${
                    currentPage === totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    className={`${styles['page-link']} page-link`}
                    onClick={(e) => {
                      e.preventDefault()
                      currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                    }}
                    aria-label="Next"
                  >
                    <span aria-hidden="true">
                      <FaAngleRight />
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
