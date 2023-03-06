<script>
import { watch, computed } from 'vue';

function convertToUnit(str, unit = 'px') {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(+str)) {
    return String(str)
  } else {
    return `${Number(str)}${unit}`
  }
}

export default {
  name: 'GProgressCircular',
  props: {
    indeterminate: Boolean,
    rotate: {
      type: [Number, String],
      default: 0,
    },
    size: {
      type: [Number, String],
      default: 32,
    },
    width: {
      type: [Number, String],
      default: 4,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  emits: ['click'],
  setup(props, context) {
    const radius = 20;
    const circumference = computed(() => 2 * Math.PI * radius);
    const normalizedValue = computed(() => {
      if (props.value < 0) {
        return 0
      }

      if (props.value > 100) {
        return 100
      }

      return parseFloat(props.value)
    });

    watch(() => props.value, () => {
      console.log('props.value', props.value)
    }, {immediate: true})

    const strokeDashArray = computed(() => Math.round(circumference.value * 1000) / 1000);
    const strokeDashOffset = computed(() => ((100 - normalizedValue.value) / 100) * circumference.value + 'px');
    const viewBoxSize = computed(() => radius / (1 - Number(props.width) / +props.size));
    const strokeWidth = computed(() => Number(props.width) / +props.size * viewBoxSize.value * 2);

    const genCircle = (name, offset) => {
      const size = 2 * viewBoxSize.value;
      const data = {
        class: 'g-progress-circular__' + name,
        fill: 'transparent',
        cx: size,
        cy: size,
        r: radius,
        'stroke-width': strokeWidth.value,
        'stroke-dasharray': strokeDashArray.value,
        'stroke-dashoffset': offset,
      }
      return <circle {...data}/>
    }

    const svgStyles = computed(() => ({
      transform: `rotate(${Number(props.rotate)}deg)`
    }));

    const genSvg = () => {
      const viewBox = `${viewBoxSize.value} ${viewBoxSize.value} ${2 * viewBoxSize.value} ${2 * viewBoxSize.value}`;
      return <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} style={svgStyles.value}>
        {props.indeterminate || genCircle('underlay', 0)}
        {genCircle('overlay', strokeDashOffset.value)}
      </svg>
    }

    const genInfo = () => {
      return context.slots.default && <div class="g-progress-circular__info">{context.slots.default()}</div>
    }

    const classes = computed(() => ({
      'g-progress-circular--indeterminate': props.indeterminate,
      'g-progress-circular': true
    }));
    const styles = computed(() => ({
      height: convertToUnit(props.size),
      width: convertToUnit(props.size),
    }));

    return () => {
      const data = {
        class: classes.value,
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': props.indeterminate ? undefined : normalizedValue.value,
        style: styles.value,
        color: props.color
      }
      return <div {...data}>
        {genSvg()}
        {genInfo()}
      </div>
    }
  },

}
</script>

<style scoped>
.g-progress-circular {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
}

.g-progress-circular > svg {
  width: 100%;
  height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.g-progress-circular--indeterminate > svg {
  animation: progress-circular-rotate 1.4s linear infinite;
  transform-origin: center center;
  transition: all .2s ease-in-out;
}

.g-progress-circular--indeterminate .g-progress-circular__overlay {
  animation: progress-circular-dash 1.4s ease-in-out infinite;
  stroke-linecap: round;
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0;
}

.g-progress-circular__info {
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 14px;
}

.g-progress-circular__underlay {
  stroke: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.g-progress-circular__overlay {
  stroke: currentColor;
  z-index: 2;
  transition: all .6s ease-in-out;
}

@keyframes progress-circular-dash {
  0% {

    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -125px;
  }
}

@keyframes progress-circular-rotate {
  100% {
    transform: rotate(360deg)
  }
}

</style>
