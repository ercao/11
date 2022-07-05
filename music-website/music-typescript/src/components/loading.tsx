import { FC } from 'react'
import { useNProgress } from '@tanem/react-nprogress'
import { Box, LinearProgress } from '@mui/material'

export const PageLoading: FC<{ isRouteChanging: boolean }> = ({ isRouteChanging }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: isRouteChanging,
  })

  return (
    <Box
      sx={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`,
        position: 'fixed',
        top: 0,
        zIndex: 'snackbar',
        width: '100%',
        borderRadius: 2,
      }}
    >
      <LinearProgress value={progress * 100} variant='determinate' />
    </Box>
  )
}
