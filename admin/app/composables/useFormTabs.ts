export function useFormTabs() {
  const tabs = useState<FormTab[]>('form-tabs', () => [])

  const activeTab = useState<string>('form-tab-active', () => '')

  const getActiveTab = computed({
    get() {
      return activeTab.value || tabs.value?.[0]?.value || ''
    },
    set(value) {
      activeTab.value = value
    }
  })

  function addTab(tab: FormTab) {
    if (!tabs.value.some((t) => t.value === tab.value)) {
      tabs.value.push(tab)
    }
  }

  function resetTabs() {
    tabs.value = []
    activeTab.value = ''
  }

  return {
    tabs,
    activeTab,
    getActiveTab,
    addTab,
    resetTabs
  }
}
