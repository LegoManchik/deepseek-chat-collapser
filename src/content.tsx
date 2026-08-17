import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef } from "react"
import { processCodeBlocks } from "./features/CodeBlocksManager"
import { processHeaders } from "./features/HeadersManager"
import { createSettingsHTML, setupSettingsHandlers } from "./settings/SettingsUI"
import "./style.css"

export const config: PlasmoCSConfig = {
    matches: ["https://chat.deepseek.com/*"],
    run_at: "document_end"
}

const Content = () => {
    const observerRef = useRef<MutationObserver | null>(null)
    const modalObserverRef = useRef<MutationObserver | null>(null)
    const processedBlocks = useRef<WeakSet<Element>>(new WeakSet())
    const processedHeaders = useRef<WeakSet<Element>>(new WeakSet())
    const settingsInjected = useRef<boolean>(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const injectSettings = () => {
        const modal = document.querySelector('.ds-modal')
        if (!modal) return

        const contentContainer = modal.querySelector('.ds-scroll-area__content')
        if (!contentContainer) return

        const isGeneralTab = contentContainer.innerHTML.includes('Тема') ||
            contentContainer.innerHTML.includes('Theme')

        if (!isGeneralTab) {
            const existing = contentContainer.querySelector('[data-settings="collapser"]')
            if (existing) {
                existing.remove()
                settingsInjected.current = false
            }
            return
        }

        if (settingsInjected.current) {
            if (contentContainer.querySelector('[data-settings="collapser"]')) return
            settingsInjected.current = false
        }

        const settingsHTML = createSettingsHTML()
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = settingsHTML
        const settingsElement = tempDiv.firstElementChild
        if (settingsElement) {
            contentContainer.appendChild(settingsElement)
            setupSettingsHandlers(contentContainer)
            settingsInjected.current = true
        }
    }

    const setupModalObserver = () => {
        const modal = document.querySelector('.ds-modal')
        if (!modal) return

        if (modalObserverRef.current) {
            modalObserverRef.current.disconnect()
        }

        const observer = new MutationObserver(() => {
            if (modal.getAttribute('aria-modal') === 'true') {
                injectSettings()
            }
        })

        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['aria-modal']
        })

        modalObserverRef.current = observer
    }

    useEffect(() => {
        const initialize = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)

            timeoutRef.current = setTimeout(() => {
                try {
                    const codeBlocks = document.querySelectorAll('[class*="md-code-block"]')
                    processCodeBlocks(codeBlocks, processedBlocks.current)

                    const messages = document.querySelectorAll('.ds-message')
                    processHeaders(messages, processedHeaders.current)

                    setupModalObserver()
                    injectSettings()

                } catch (error) {
                    console.error('DeepSeek Enhancer error:', error)
                }
            }, 500)
        }

        const initTimeout = setTimeout(initialize, 1000)

        const observer = new MutationObserver(() => {
            requestAnimationFrame(initialize)
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        })

        observerRef.current = observer

        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement
            if (target.closest?.('[role="button"]') && target.textContent?.includes('Settings')) {
                setTimeout(() => {
                    setupModalObserver()
                    injectSettings()
                }, 300)
            }
        })

        return () => {
            observerRef.current?.disconnect()
            modalObserverRef.current?.disconnect()
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            clearTimeout(initTimeout)
        }
    }, [])

    return null
}

export default Content