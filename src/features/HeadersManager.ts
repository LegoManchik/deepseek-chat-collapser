import React from "react"
import { createRoot } from "react-dom/client"
import HeaderCollapser from "../components/HeaderCollapser"

export const processHeaders = (messages: NodeListOf<Element>, processedHeaders: WeakSet<Element>) => {
    messages.forEach((message) => {
        const headers = message.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headers.forEach((header) => {
            if (processedHeaders.has(header)) return
            if (header.closest('[data-header-collapser]')) return
            if (header.closest('.md-code-block')) return

            const container = document.createElement("span")
            container.setAttribute("data-header-collapser", "true")
            container.style.display = "inline-flex"
            container.style.alignItems = "center"
            container.style.marginRight = "6px"

            header.insertBefore(container, header.firstChild)

            const root = createRoot(container)
            root.render(React.createElement(HeaderCollapser, { headerElement: header as HTMLElement }))

            processedHeaders.add(header)
        })
    })
}