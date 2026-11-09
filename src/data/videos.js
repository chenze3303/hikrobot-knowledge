import { categoryMap } from './categories'

/**
 * 视频教程索引（当前为空，等真实视频上线后按下面的字段追加）。
 *
 * 视频文件放在 public/videos/，封面放在 public/images/videos/。
 * src / cover 使用相对 public 的路径即可，构建时会自动补上仓库子路径。
 * 如果视频托管在 B 站、YouTube 等外部平台，把 link 填成对应地址即可，
 * 此时 src 可以留空（封面仍然必填）。
 *
 * {
 *   id: 'idmvs-quickstart',
 *   title: 'IDMVS 连接与实时预览',
 *   summary: '一句话说明视频内容。',
 *   cover: 'images/videos/idmvs-quickstart.jpg',
 *   src: 'videos/idmvs-quickstart.mp4',
 *   link: '',
 *   duration: '03:24',
 *   level: '入门',
 *   tags: ['IDMVS', '连接'],
 *   updated: '2026-11-09',
 *   order: 1
 * }
 */
const videos = []

const BASE_URL = import.meta.env.BASE_URL

export function assetUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${BASE_URL}${path.replace(/^\.?\//, '')}`
}

export function videoHref(video) {
  return video.link || assetUrl(video.src)
}

export function videoPoster(video) {
  return assetUrl(video.cover)
}

export function getVideos() {
  return [...videos].sort((a, b) => a.order - b.order || b.updated.localeCompare(a.updated))
}

export function getVideo(id) {
  return videos.find((video) => video.id === id) || null
}

/** 视频也进入全局搜索，结果里标记 kind: 'video' 以便区分跳转方式。 */
export function searchVideos(query) {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return []

  return getVideos()
    .map((video) => {
      const title = video.title.toLowerCase()
      const summary = video.summary.toLowerCase()
      const tags = video.tags.join(' ').toLowerCase()
      let score = 0
      if (title.includes(keyword)) score += 18
      if (tags.includes(keyword)) score += 10
      if (summary.includes(keyword)) score += 6
      if (score === 0) return null
      return {
        ...video,
        kind: 'video',
        slug: video.id,
        category: categoryMap.videos,
        score,
        snippet: video.summary
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
}
