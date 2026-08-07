/**
 * Swiper 封装 composable
 * 基于 npm 包 swiper，模块化按需加载
 */
import Swiper from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'

type SwiperOptions = ConstructorParameters<typeof Swiper>[1]

/** 初始化一个 Swiper（仅客户端执行） */
export function initSwiper(selector: string, options: SwiperOptions = {}): Swiper | null {
  if (typeof window === 'undefined') return null

  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return null

  return new Swiper(el, {
    modules: [Autoplay, Pagination],
    ...options
  })
}
