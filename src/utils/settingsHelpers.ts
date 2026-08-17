export const defaultSettings = {
    autoCollapseLongBlocks: false,
    autoCollapseAllCode: false,
    autoCollapseAllHeaders: false,
    longBlockThreshold: 300
}

export const getSettings = () => {
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

export const saveSettings = (settings: any) => {
    localStorage.setItem('deepseek-collapser-settings', JSON.stringify(settings))
    window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings }))
}