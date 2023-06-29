<script lang="jsx">
import {compact, last, trim} from 'lodash-es';
import dayjs from 'dayjs';
import {computed} from 'vue';

/**
 * Parse log line to parts
 * @param {String} logLine
 * @return {{level: string, content: string, timestamp: string}}
 */
const parseLogLine = logLine => {
  try {
    const regexResult = /\[(?<timestamp>.*?)\]\s\[(?<level>.*?)\]\s\[(?<content>.*)\]/g.exec(logLine || '')
    if (regexResult) {
      const {timestamp, level, content} = regexResult.groups
      return {
        timestamp: dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'),
        level,
        content
      }
    } else {
      console.error('Could not parse', logLine)
    }

    return {
      level: 'log',
      content: logLine
    }

  } catch (e) {
    console.log('parseLogLine', e)
    return {
      level: 'log',
      content: logLine
    }
  }
}

export default {
  name: 'LogPresenter',
  props: { content: String, showErrorOnly: Boolean, fallback: Boolean, filter: String },
  setup(props) {
    const logLineStyle = computed(() => ({
      display: 'grid',
      gridTemplateColumns: '130px 1fr',
      borderBottom: '1px solid #5a5959'
    }))
    const logLines = computed(() => compact(props.content.split('\n').map(trim)))
    const filteredLogLines = computed(() => {
      if (!props.filter)
        return logLines.value
      return logLines.value.filter(v => v.indexOf(props.filter) > -1)
    })

    const processErrorLog = errLog => {
      const lines = errLog.split('\\n').map(line => line.replace(/\\"/g, '"').replace(/\s/g, '&nbsp;'));
      if (lines.length > 0) {
        lines[0] = lines[0].substr(1)
        const lastLine = last(lines)
        lines[lines.length - 1] = lastLine.substr(0, lastLine.length - 1)
      }

      return lines.map(line => line.indexOf('eval') > -1 ? <div>{line}</div> : <div v-html={line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}/>)
    }

    const renderLogLine = {
      ['log']: (timestamp = '', content = '') => <div style={logLineStyle.value} class="line log">
        <span class="timestamp">{timestamp}</span>
        <span class="content">{content.replace(/"/g, '')}</span>
      </div>,
      ['warn']: (timestamp = '', content = '') => <div style={logLineStyle.value} class="line warn">
        <span class="timestamp">{timestamp}</span>
        <span class="content">{content.replace(/"/g, '')}</span>
      </div>,
      ['debug']: (timestamp = '', content = '') => <div style={logLineStyle.value} class="line debug">
        <span class="timestamp">{timestamp}</span>
        <span class="content">{content.replace(/"/g, '')}</span>
      </div>,
      ['error']: (timestamp = '', content= '') => <div style={logLineStyle.value} class="line error">
        <span class="timestamp">{timestamp}</span>
        <span class="content">{processErrorLog(content)}</span>
      </div>,
    }

    const renderLogLines = () => {
      try {
        return filteredLogLines.value.map(parseLogLine).map(
            ({timestamp, level, content}) => {
              if (level !== 'error' && props.showErrorOnly)
                return <div style="visible: false"/>
              if (!renderLogLine[level])
                return <div style="visible: false"/>
              return renderLogLine[level](timestamp, (content || '').replace(/","/g, ' '))
            })
      } catch (e) {
        console.error(e)
      }
    }

    return () => <div style="font-size: 13px" class="bc:#fff">
      {props.fallback ? <pre style="white-space: pre-wrap; max-width: 100%; color: #aaa">{props.content}</pre> : renderLogLines()}
    </div>
  }
}
</script>
<style scoped>
.line * {user-select: text;}
.debug .content > div {
  color: rgb(231, 172, 71);
}
.error .content > div {
  color: rgb(239, 134, 133);
}
.warn .content > div {
  color: rgb(231, 172, 71);
}
.line {padding: 4px}
.line:hover {
  background-color: #eee;
}

.content {
  color: inherit;
  padding-left: 5px;
  word-break: break-all;
}

.timestamp {
  color: #359929;
  padding-left: 5px;
}
</style>
