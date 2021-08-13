export function getDefaultOptions() {
  const com = arguments[0]
  let { state, path } = com
  path = path.substring(0, path.indexOf('.state') + 6)
  const pageState = com.getAnyStateByPath(path)
  const data = pageState.data
  if (data) {
    const mapData = data[state.link]
    state.options.length = 0
    state.value = null
    mapData.forEach(item => {
      state.options.push({
        value: item.uuid,
        label: item.name
      })
      const isMultiSelect = state.multiple
      isMultiSelect ? state.value.push(item.uuid) : state.value = item.uuid
    })
  }
}
