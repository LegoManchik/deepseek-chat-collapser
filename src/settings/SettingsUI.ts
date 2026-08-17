// noinspection CssUnresolvedCustomProperty

import { getSettings, saveSettings } from "../utils/settingsHelpers"

export const createSettingsHTML = () => {
    const settings = getSettings()

    return `
        <div data-settings="collapser" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-secondary, rgba(0,0,0,0.08));">
            <div style="font-size: 14px; font-weight: 500; color: var(--dsw-alias-label-primary); margin-bottom: 12px;">
                Chat Collapser
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0;">
                    <div style="font-size: 13px; color: var(--dsw-alias-label-primary);">Auto-collapse long code blocks</div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 12px; color: var(--dsw-alias-label-secondary);">> ${settings.longBlockThreshold || 300} lines</span>
                        <button 
                            class="ds-switch ds-switch--size-m ${settings.autoCollapseLongBlocks ? 'ds-switch--checked' : ''}" 
                            role="switch" 
                            aria-checked="${settings.autoCollapseLongBlocks ? 'true' : 'false'}"
                            tabindex="0"
                            data-switch="auto-long-blocks"
                            style="
                                --switch-color: ${settings.autoCollapseLongBlocks ? 'var(--dsw-alias-button-primary-fill)' : 'var(--dsw-alias-label-caption)'};
                                --switch-thumb-color: var(--dsw-static-neutral-bluish-00);
                            "
                        >
                            <div class="ds-switch-thumb" aria-hidden="true"></div>
                        </button>
                    </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0;">
                    <div style="font-size: 13px; color: var(--dsw-alias-label-primary);">Auto-collapse all code blocks</div>
                    <button 
                        class="ds-switch ds-switch--size-m ${settings.autoCollapseAllCode ? 'ds-switch--checked' : ''}" 
                        role="switch" 
                        aria-checked="${settings.autoCollapseAllCode ? 'true' : 'false'}"
                        tabindex="0"
                        data-switch="auto-all-code"
                        style="
                            --switch-color: ${settings.autoCollapseAllCode ? 'var(--dsw-alias-button-primary-fill)' : 'var(--dsw-alias-label-caption)'};
                            --switch-thumb-color: var(--dsw-static-neutral-bluish-00);
                        "
                    >
                        <div class="ds-switch-thumb" aria-hidden="true"></div>
                    </button>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0;">
                    <div style="font-size: 13px; color: var(--dsw-alias-label-primary);">Auto-collapse all headers</div>
                    <button 
                        class="ds-switch ds-switch--size-m ${settings.autoCollapseAllHeaders ? 'ds-switch--checked' : ''}" 
                        role="switch" 
                        aria-checked="${settings.autoCollapseAllHeaders ? 'true' : 'false'}"
                        tabindex="0"
                        data-switch="auto-headers"
                        style="
                            --switch-color: ${settings.autoCollapseAllHeaders ? 'var(--dsw-alias-button-primary-fill)' : 'var(--dsw-alias-label-caption)'};
                            --switch-thumb-color: var(--dsw-static-neutral-bluish-00);
                        "
                    >
                        <div class="ds-switch-thumb" aria-hidden="true"></div>
                    </button>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0;">
                    <div style="font-size: 13px; color: var(--dsw-alias-label-primary);">Long block threshold</div>
                    <input 
                        type="number" 
                        id="threshold-input" 
                        value="${settings.longBlockThreshold || 300}" 
                        min="100" 
                        max="1000" 
                        step="50" 
                        style="
                            height: var(--ds-control-height-m, 32px);
                            font-size: var(--dsw-font-s-14-font-size, 14px);
                            line-height: var(--dsw-font-s-14-line-height, 20px);
                            padding: 0 14px;
                            min-width: 72px;
                            width: 72px;
                            border-radius: 4096px;
                            border: 1px solid var(--dsw-alias-border-l2, #d0d0d0);
                            background: transparent;
                            color: var(--dsw-alias-label-primary, #1a1a1a);
                            text-align: center;
                            outline: none;
                            font-weight: 400;
                            font-variant-numeric: tabular-nums;
                            box-sizing: border-box;
                            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                        "
                        onmouseenter="this.style.background='var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.04))'"
                        onmouseleave="this.style.background='transparent'"
                        onfocus="this.style.borderColor='var(--dsw-alias-button-primary-fill, #4f6ef7)'; this.style.boxShadow='0 0 0 2px var(--dsw-alias-button-primary-fill, #4f6ef7)'; this.style.background='var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.04))'"
                        onblur="this.style.borderColor='var(--dsw-alias-border-l2, #d0d0d0)'; this.style.boxShadow='none'; this.style.background='transparent'"
                    >
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                    <button id="apply-settings-btn" style="
                        height: var(--ds-control-height-m, 32px);
                        font-size: var(--dsw-font-s-14-font-size, 14px);
                        line-height: var(--dsw-font-s-14-line-height, 20px);
                        padding: 0 20px;
                        min-width: 72px;
                        border-radius: 4096px;
                        background: #4f6ef7;
                        color: #fff;
                        border: none;
                        cursor: pointer;
                        font-weight: 500;
                        box-sizing: border-box;
                        font-variant-numeric: tabular-nums;
                        transition: background-color 0.2s ease;
                    "
                    onmouseenter="this.style.background='#6b84f9'"
                    onmouseleave="this.style.background='#4f6ef7'"
                    >
                        Apply Settings
                    </button>
                </div>
            </div>
        </div>
    `
}

export const setupSettingsHandlers = (container: Element) => {
    container.querySelectorAll('.ds-switch').forEach((switchEl) => {
        const el = switchEl as HTMLElement

        el.addEventListener('click', () => {
            const isChecked = el.classList.contains('ds-switch--checked')

            if (isChecked) {
                el.classList.remove('ds-switch--checked')
                el.setAttribute('aria-checked', 'false')
                el.style.setProperty('--switch-color', 'var(--dsw-alias-label-caption)')
            } else {
                el.classList.add('ds-switch--checked')
                el.setAttribute('aria-checked', 'true')
                el.style.setProperty('--switch-color', 'var(--dsw-alias-button-primary-fill)')
            }
        })
    })

    const thresholdInput = container.querySelector('#threshold-input') as HTMLInputElement
    if (thresholdInput) {
        thresholdInput.addEventListener('mouseenter', () => {
            thresholdInput.style.background = 'var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.04))'
        })
        thresholdInput.addEventListener('mouseleave', () => {
            thresholdInput.style.background = 'transparent'
        })
        thresholdInput.addEventListener('focus', () => {
            thresholdInput.style.borderColor = 'var(--dsw-alias-button-primary-fill, #4f6ef7)'
            thresholdInput.style.boxShadow = '0 0 0 2px var(--dsw-alias-button-primary-fill, #4f6ef7)'
            thresholdInput.style.background = 'var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.04))'
        })
        thresholdInput.addEventListener('blur', () => {
            thresholdInput.style.borderColor = 'var(--dsw-alias-border-l2, #d0d0d0)'
            thresholdInput.style.boxShadow = 'none'
            thresholdInput.style.background = 'transparent'
        })
    }

    const applyBtn = container.querySelector('#apply-settings-btn') as HTMLButtonElement
    if (applyBtn) {
        applyBtn.addEventListener('mouseenter', () => {
            applyBtn.style.background = '#6b84f9'
        })
        applyBtn.addEventListener('mouseleave', () => {
            applyBtn.style.background = '#4f6ef7'
        })

        applyBtn.addEventListener('click', () => {
            const autoLongSwitch = container.querySelector('[data-switch="auto-long-blocks"]') as HTMLElement
            const autoCodeSwitch = container.querySelector('[data-switch="auto-all-code"]') as HTMLElement
            const autoHeadersSwitch = container.querySelector('[data-switch="auto-headers"]') as HTMLElement
            const threshold = container.querySelector('#threshold-input') as HTMLInputElement

            const newSettings = {
                autoCollapseLongBlocks: autoLongSwitch?.classList.contains('ds-switch--checked') || false,
                autoCollapseAllCode: autoCodeSwitch?.classList.contains('ds-switch--checked') || false,
                autoCollapseAllHeaders: autoHeadersSwitch?.classList.contains('ds-switch--checked') || false,
                longBlockThreshold: parseInt(threshold?.value) || 300
            }

            saveSettings(newSettings)

            setTimeout(() => {
                location.reload()
            }, 1600)
        })
    }
}