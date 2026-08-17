import React from "react"
import { createRoot } from "react-dom/client"
import CodeCollapser from "../components/CodeCollapser"
import { fixSticky, findFlexContainer } from "../utils/stickyFix"

export const processCodeBlocks = (blocks: NodeListOf<Element>, processedBlocks: WeakSet<Element>) => {
    blocks.forEach((block) => {
        if (processedBlocks.has(block)) return

        const banner = block.querySelector('.md-code-block-banner-wrap')
        if (!banner) return

        const bannerWrap = banner as HTMLElement
        fixSticky(bannerWrap)

        const bannerInner = banner.querySelector('.md-code-block-banner')
        if (!bannerInner) return

        const flexContainer = findFlexContainer(bannerInner)
        if (!flexContainer) return

        const children = Array.from(flexContainer.children)
        if (children.length < 1) return

        const languageContainer = children[0]

        const container = document.createElement("div")
        container.setAttribute("data-code-collapser", "true")
        container.style.display = "inline-flex"
        container.style.alignItems = "center"

        flexContainer.insertBefore(container, languageContainer)

        const root = createRoot(container)
        root.render(React.createElement(CodeCollapser, { codeBlock: block as HTMLElement }))

        const flexEl = flexContainer as HTMLElement
        flexEl.style.alignItems = 'center'

        let buttonsContainer: Element | null = null
        for (const child of children) {
            if (child.querySelector('.ds-button')) {
                buttonsContainer = child
                break
            }
        }

        if (buttonsContainer) {
            const buttonsEl = buttonsContainer as HTMLElement
            buttonsEl.style.marginLeft = 'auto'
        }

        processedBlocks.add(block)
    })
}