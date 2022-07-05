import { Box } from '@mui/material'
import Scrollbars, { ScrollbarsProps } from 'rc-scrollbars'
import { CustomRenderer } from 'rc-scrollbars/lib/Scrollbars/types'
import { FC } from 'react'

type ScrollbarProps = Partial<ScrollbarsProps>

const view: CustomRenderer = ({ ...props }) => {
  return <div {...props} />
}

const trackVertical: CustomRenderer = ({ style, ...props }) => {
  return (
    <Box
      sx={{
        ...style,
        zIndex: 1200,
        width: 10,
        borderRadius: 10,
      }}
      {...props}
    />
  )
}
const thumbVertical: CustomRenderer = ({ style, ...props }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        ...style,
      }}
      {...props}
    />
  )
}

const trackHorizontal: CustomRenderer = ({ ...props }) => {
  return <div {...props} />
}

const thumbHorizontal: CustomRenderer = ({ ...props }) => {
  return <div {...props} />
}

/**
 * 滚动栏
 * @param children
 * @param props
 * @constructor
 */
export const Scrollbar: FC<ScrollbarProps> = ({ children, ...props }) => {
  return (
    <Scrollbars
      renderView={view}
      renderTrackVertical={trackVertical}
      renderThumbVertical={thumbVertical}
      renderThumbHorizontal={thumbHorizontal}
      renderTrackHorizontal={trackHorizontal}
      disableDefaultStyles
      autoHeight
      autoHide
      universal
      autoHeightMax='100vh'
      autoHeightMin='100vh'
      autoHideDuration={100}
      {...props}
    >
      {children}
    </Scrollbars>
  )
}
