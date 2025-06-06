import type { ProfiledMessage } from '@/data/models/profiled-message-model'
import { Timeline } from 'antd'
import parse from 'html-react-parser'
import type { JSX } from 'react'

type Props = {
  messages: ProfiledMessage[]
}

export function ProfiledMessageHandler ({ messages }: Props): JSX.Element {
  const handleColor = (type: string): string => {
    switch (type) {
      case 'danger':
        return 'red'
      case 'warning':
        return 'orange'
      default:
        return 'blue'
    }
  }

  if (messages && messages.length > 0) {
    return (
      <div
        data-testid='profiled-message-handler'
        style={{
          padding: '12px 12px 0px 0px',
          maxHeight: '30vh',
          overflow: 'auto'
        }}
      >
        <Timeline
          items={
            messages.map((message, index) => ({
              key: index,
              children: parse(message.message),
              color: handleColor(message.type)
            }))
          }
        />
      </div>
    )
  }

  return null
}
