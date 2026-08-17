export const fixSticky = (element: HTMLElement) => {
    if (!element) return

    element.style.position = 'sticky'
    element.style.top = '0'
    element.style.zIndex = '6'
    element.style.backgroundColor = 'var(--dsw-alias-bg-base)'
    element.style.borderTopLeftRadius = 'var(--dsl-code-block-border-radius)'
    element.style.borderTopRightRadius = 'var(--dsl-code-block-border-radius)'
}

export const findFlexContainer = (bannerInner: Element): Element | null => {
    for (const child of Array.from(bannerInner.children)) {
        const computedStyle = window.getComputedStyle(child)
        if (computedStyle.display === 'flex') {
            return child
        }
    }
    return null
}