/**
 * 联系客服状态管理（复制微信 / WhatsApp 弹层）
 * 使用 useState：SSR 状态隔离，客户端从 payload 恢复
 */
export interface ContactInfo {
  wechat: string
  whatsapp: string
}

export function useContactStore() {
  const contactInfo = useState<ContactInfo>('contact-info', () => ({
    wechat: 'WatchVip8888',
    whatsapp: '+8613800138000'
  }))

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

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 降级方案
      const ta = document.createElement('textarea')
      ta.value = text
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
    copyText
  }
}
