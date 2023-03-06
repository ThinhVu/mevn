<script>
// icon@size:color-or-color-class
function parseIconData(iconData, propsColor) {
  const iconPath = {
    icon: '',
    size: '',
    color: ''
  }
  let part = 'icon'

  for(let char of iconData) {
    if (char === '@') {
      part = 'size'
    } else if (char === ':') {
      part = 'color'
    } else {
      iconPath[part] += char
    }
  }

  return {
    icon: iconPath.icon,
    size: `${iconPath.size || 24}px`,
    color: iconPath.color || propsColor || '#000'
  }
}

export default {
  name: 'Icon',
  props: { class: String, color: String },
  setup(props, ctx) {
    return () => {
      const iconData = ctx.slots.default()[0].children
      const {icon, size, color} = parseIconData(iconData, props.color)
      const iconClass = [ props.class, icon, color.startsWith('.') && color.substr(1) ]
      const iconStyle = { width: size, height: size, fontSize: size, ...(color.startsWith('.') ? {} : { color }) }
      return <i class={iconClass} style={iconStyle} data-raw={iconData}/>
    }
  }
}
</script>
