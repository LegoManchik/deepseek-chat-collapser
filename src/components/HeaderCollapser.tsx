import React, { useState, useEffect, useCallback, useRef } from "react"

interface HeaderCollapserProps {
    headerElement: HTMLElement
}

const HeaderCollapser: React.FC<HeaderCollapserProps> = ({ headerElement }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [contentWrapper, setContentWrapper] = useState<HTMLElement | null>(null)
    const [hasContent, setHasContent] = useState(true)
    const [isAutoCollapsed, setIsAutoCollapsed] = useState(false)
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        let next = headerElement.nextElementSibling
        const content: HTMLElement[] = []

        while (next && !next.tagName.match(/^H[1-6]$/)) {
            if (next.textContent?.trim() || next.querySelector('*')) {
                content.push(next as HTMLElement)
            }
            next = next.nextElementSibling
        }

        if (content.length === 0) {
            setHasContent(false)
            return
        }

        const wrapper = document.createElement('div')
        wrapper.className = 'header-content-wrapper'
        wrapper.style.maxHeight = 'none'
        wrapper.style.overflow = 'hidden'
        wrapper.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'

        content.forEach(el => wrapper.appendChild(el))
        headerElement.after(wrapper)
        setContentWrapper(wrapper)

        const settings = JSON.parse(localStorage.getItem('deepseek-collapser-settings') || '{}')
        if (settings.autoCollapseAllHeaders && !isAutoCollapsed) {
            setIsAutoCollapsed(true)
            setTimeout(() => {
                if (wrapper) {
                    wrapper.style.maxHeight = '0px'
                    setIsCollapsed(true)
                }
            }, 300)
        }

        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current)
            }
            wrapper.remove()
        }
    }, [headerElement])

    useEffect(() => {
        const handleSettingsUpdate = (e: CustomEvent) => {
            const settings = e.detail
            if (settings.autoCollapseAllHeaders && contentWrapper && !isCollapsed && !isAutoCollapsed) {
                setIsAutoCollapsed(true)
                contentWrapper.style.maxHeight = '0px'
                setIsCollapsed(true)
            }
        }

        window.addEventListener('settings-updated', handleSettingsUpdate as EventListener)
        return () => {
            window.removeEventListener('settings-updated', handleSettingsUpdate as EventListener)
        }
    }, [contentWrapper, isCollapsed, isAutoCollapsed])

    const toggleCollapse = useCallback(() => {
        if (!contentWrapper) return

        if (!isCollapsed) {
            const height = contentWrapper.scrollHeight
            contentWrapper.style.maxHeight = height + 'px'

            requestAnimationFrame(() => {
                contentWrapper.style.maxHeight = '0px'
                animationTimeoutRef.current = setTimeout(() => {
                    setIsCollapsed(true)
                }, 400)
            })
        } else {
            contentWrapper.style.maxHeight = '0px'

            requestAnimationFrame(() => {
                contentWrapper.style.maxHeight = contentWrapper.scrollHeight + 'px'
                animationTimeoutRef.current = setTimeout(() => {
                    contentWrapper.style.maxHeight = 'none'
                    setIsCollapsed(false)
                    setIsAutoCollapsed(false)
                }, 400)
            })
        }
    }, [isCollapsed, contentWrapper])

    if (!hasContent) return null

    const buttonStyle = {
        height: "24px",
        lineHeight: "16px",
        fontSize: "12px",
        fontWeight: "500" as const,
        borderRadius: "4096px",
        padding: "0 8px",
        color: "var(--dsw-alias-label-secondary, #666)",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        userSelect: "none" as const,
        whiteSpace: "nowrap" as const,
        boxSizing: "border-box" as const,
        transition: "background-color 0.2s ease, opacity 0.2s ease",
        fontVariantNumeric: "tabular-nums" as const,
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        display: "inline-flex",
        position: "relative" as const,
        gap: "3px",
        minWidth: "24px",
        outline: "none",
        opacity: 0.7
    }

    return (
        <button
            onClick={toggleCollapse}
            style={buttonStyle}
            className="header-collapser-btn"
            data-collapsed={isCollapsed}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.05))"
                e.currentTarget.style.opacity = "1"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.opacity = "0.7"
            }}
            title={isCollapsed ? "Expand section" : "Collapse section"}
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: isCollapsed ? 'rotate(270deg)' : 'rotate(360deg)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0
                }}
            >
                <path
                    d="M8 10L3 5L4.5 3.5L8 7L11.5 3.5L13 5L8 10Z"
                    fill="currentColor"
                />
            </svg>
        </button>
    )
}

export default HeaderCollapser