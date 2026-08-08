/**
 * 联系客服状态管理（复制微信 / WhatsApp 弹层）
 * 使用 useState：SSR 状态隔离，客户端从 payload 恢复
 */
import { CONTACT } from '../../site.config'

export interface ContactInfo {
  wechat: string
  whatsapp: string
}

const DEFAULT_CONTACT: ContactInfo = {
  wechat: CONTACT.wechat,
  whatsapp: CONTACT.whatsapp
}

export function useContactStore() {
  const contactInfo = useState<ContactInfo>('contact-info', () => ({ ...DEFAULT_CONTACT }))

  const sheetVisible = useState<boolean>('contact-sheet-visible', () => false)
  const toastMsg = useState<string>('contact-toast-msg', () => '')
  const toastVisible = useState<boolean>('contact-toast-visible', () => false)

  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function open() {
    sheetVisible.value = true
  }

  function close() {
    sheetVisible.value = false
  }

  function showToast(msg: string) {
    toastMsg.value = msg
    toastVisible.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastVisible.value = false
    }, 2200)
  }

  /** 获取当前联系方式（带兜底，避免 undefined） */
  function getContact(): ContactInfo {
    const c = contactInfo.value
    if (!c || typeof c !== 'object') return { ...DEFAULT_CONTACT }
    return {
      wechat: typeof c.wechat === 'string' && c.wechat ? c.wechat : DEFAULT_CONTACT.wechat,
      whatsapp: typeof c.whatsapp === 'string' && c.whatsapp ? c.whatsapp : DEFAULT_CONTACT.whatsapp
    }
  }

  /** 设置联系方式（可按产品覆盖） */
  function setContact(info: Partial<ContactInfo>) {
    const current = getContact()
    contactInfo.value = {
      wechat: typeof info.wechat === 'string' && info.wechat ? info.wechat : current.wechat,
      whatsapp: typeof info.whatsapp === 'string' && info.whatsapp ? info.whatsapp : current.whatsapp
    }
  }

  async function copyText(text: string) {
    const safe = typeof text === 'string' ? text : ''
    try {
      await navigator.clipboard.writeText(safe)
    } catch {
      // 降级方案
      const ta = document.createElement('textarea')
      ta.value = safe
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  }

  return {
    contactInfo,
    sheetVisible,
    toastMsg,
    toastVisible,
    open,
    close,
    showToast,
    copyText,
    getContact,
    setContact
  }
}
