import React, { useState, useEffect, useRef, useCallback } from "react"

interface CodeCollapserProps {
    codeBlock: HTMLElement
}

const CodeCollapser: React.FC<CodeCollapserProps> = ({ codeBlock }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isAutoCollapsed, setIsAutoCollapsed] = useState(false)
    const [userInteracted, setUserInteracted] = useState(false)
    const preElementRef = useRef<HTMLElement | null>(null)
    const resizeObserverRef = useRef<ResizeObserver | null>(null)
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const scrollPositionRef = useRef<number>(0)

    const getSettings = () => {
        const defaultSettings = {
            autoCollapseLongBlocks: false,
            autoCollapseAllCode: false,
            autoCollapseAllHeaders: false,
            longBlockThreshold: 300
        }
        try {
            const saved = localStorage.getItem('deepseek-collapser-settings')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (!parsed.longBlockThreshold || parsed.longBlockThreshold < 100) {
                    parsed.longBlockThreshold = 300
                }
                return { ...defaultSettings, ...parsed }
            }
        } catch (e) {
            console.error('Failed to load settings:', e)
        }
        return defaultSettings
    }

    const preserveScroll = (callback: () => void) => {
        scrollPositionRef.current = window.scrollY
        callback()
        setTimeout(() => {
            window.scrollTo({
                top: scrollPositionRef.current,
                behavior: 'instant'
            })
        }, 50)
    }

    useEffect(() => {
        const preElement = codeBlock.querySelector('pre') as HTMLElement
        if (!preElement) {
            setIsVisible(false)
            return
        }

        preElementRef.current = preElement

        const checkHeight = () => {
            if (preElement) {
                const height = preElement.scrollHeight
                const lineHeight = parseInt(getComputedStyle(preElement).lineHeight) || 20
                const lines = Math.floor(height / lineHeight)

                const settings = getSettings()
                const threshold = settings.longBlockThreshold || 300

                setIsVisible(height > 200)

                if (!userInteracted && settings.autoCollapseLongBlocks && lines > threshold && !isCollapsed && !isAutoCollapsed && !isAnimating) {
                    setIsAutoCollapsed(true)
                    preserveScroll(() => {
                        setTimeout(() => {
                            if (preElement) {
                                preElement.style.maxHeight = "100px"
                                preElement.style.overflow = "hidden"
                                preElement.style.maskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                                preElement.style.webkitMaskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                                setIsCollapsed(true)
                            }
                        }, 300)
                    })
                }

                if (!userInteracted && settings.autoCollapseAllCode && !isCollapsed && !isAutoCollapsed && !isAnimating) {
                    setIsAutoCollapsed(true)
                    preserveScroll(() => {
                        setTimeout(() => {
                            if (preElement) {
                                preElement.style.maxHeight = "100px"
                                preElement.style.overflow = "hidden"
                                preElement.style.maskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                                preElement.style.webkitMaskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                                setIsCollapsed(true)
                            }
                        }, 400)
                    })
                }
            }
        }

        setTimeout(() => {
            requestAnimationFrame(checkHeight)
        }, 500)

        let resizeTimeout: NodeJS.Timeout | null = null
        const resizeObserver = new ResizeObserver(() => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout)
            }
            resizeTimeout = setTimeout(() => {
                requestAnimationFrame(checkHeight)
            }, 300)
        })

        resizeObserver.observe(preElement)
        resizeObserverRef.current = resizeObserver

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect()
            }
            if (resizeTimeout) {
                clearTimeout(resizeTimeout)
            }
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current)
            }
        }
    }, [codeBlock, userInteracted])

    useEffect(() => {
        const handleSettingsUpdate = (e: CustomEvent) => {
            const settings = e.detail
            const preElement = preElementRef.current
            if (!preElement) return

            if (userInteracted) return

            if (settings.autoCollapseAllCode && !isCollapsed && !isAutoCollapsed && !isAnimating) {
                setIsAutoCollapsed(true)
                preserveScroll(() => {
                    preElement.style.maxHeight = "100px"
                    preElement.style.overflow = "hidden"
                    preElement.style.maskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                    preElement.style.webkitMaskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                    setIsCollapsed(true)
                })
            }
        }

        window.addEventListener('settings-updated', handleSettingsUpdate as EventListener)
        return () => {
            window.removeEventListener('settings-updated', handleSettingsUpdate as EventListener)
        }
    }, [isCollapsed, isAutoCollapsed, isAnimating, userInteracted])

    const toggleCollapse = useCallback(() => {
        const preElement = preElementRef.current
        if (!preElement || isAnimating) return

        setUserInteracted(true)
        setIsAnimating(true)

        scrollPositionRef.current = window.scrollY

        const fullHeight = preElement.scrollHeight

        if (!isCollapsed) {
            preElement.style.maxHeight = fullHeight + "px"
            preElement.style.overflow = "hidden"

            requestAnimationFrame(() => {
                preElement.style.transition = "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                preElement.style.maxHeight = "100px"

                animationTimeoutRef.current = setTimeout(() => {
                    preElement.style.maskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                    preElement.style.webkitMaskImage = "linear-gradient(to bottom, black 60%, transparent 100%)"
                    setIsCollapsed(true)
                    setIsAnimating(false)
                    window.scrollTo({
                        top: scrollPositionRef.current,
                        behavior: 'instant'
                    })
                }, 400)
            })
        } else {
            preElement.style.maskImage = "none"
            preElement.style.webkitMaskImage = "none"

            const currentHeight = preElement.scrollHeight
            preElement.style.maxHeight = currentHeight + "px"
            preElement.style.overflow = "hidden"

            requestAnimationFrame(() => {
                preElement.style.transition = "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                preElement.style.maxHeight = fullHeight + "px"

                animationTimeoutRef.current = setTimeout(() => {
                    preElement.style.maxHeight = "none"
                    preElement.style.overflow = "visible"
                    setIsCollapsed(false)
                    setIsAutoCollapsed(false)
                    setIsAnimating(false)
                    window.scrollTo({
                        top: scrollPositionRef.current,
                        behavior: 'instant'
                    })
                }, 400)
            })
        }
    }, [isCollapsed, isAnimating])

    if (!isVisible) return null

    const buttonStyle = {
        height: "24px",
        lineHeight: "16px",
        fontSize: "12px",
        fontWeight: "500" as const,
        borderRadius: "4096px",
        padding: "0 10px",
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
        minWidth: "58px",
        outline: "none",
        opacity: isAnimating ? 0.5 : 0.7
    }

    return (
        <button
            onClick={toggleCollapse}
            style={buttonStyle}
            className="code-collapser-btn"
            data-collapsed={isCollapsed}
            disabled={isAnimating}
            onMouseEnter={(e) => {
                if (!isAnimating) {
                    e.currentTarget.style.backgroundColor = "var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.05))"
                    e.currentTarget.style.opacity = "1"
                }
            }}
            onMouseLeave={(e) => {
                if (!isAnimating) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.opacity = "0.7"
                }
            }}
            title={isCollapsed ? "Expand code" : "Collapse code"}
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
            <span style={{ fontSize: '12px' }}>
                {isCollapsed ? 'Expand' : 'Collapse'}
            </span>
        </button>
    )
}

export default CodeCollapser