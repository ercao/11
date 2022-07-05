import dynamic from 'next/dynamic'
import {
  Box,
  Container,
  Drawer,
  LinearProgress,
  linearProgressClasses,
  Slider as MuiSlider,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import {
  ExpandMoreRounded,
  PauseRounded,
  PlayArrowRounded,
  QueueMusicRounded,
  RepeatOneRounded,
  RepeatRounded,
  SkipNextRounded,
  SkipPreviousRounded,
  VolumeDownRounded,
  VolumeOffRounded,
  VolumeUpRounded,
} from '@mui/icons-material'
import { IconButton } from 'src/components/button'
import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useMusicQueue } from 'src/utils/hook'
import { RowHeader } from 'src/components/cover'
import { MusicList } from 'src/components/music-list'
import { Scrollbar } from 'src/components/scrollbar'
import { useSnackbar } from 'notistack'

// fix ssr
const ReactPlayerLazy = dynamic(() => import('react-player/lazy'), {
  ssr: false,
})

const Footer = styled('div')`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  box-sizing: border-box;
`

const Cover = styled('img')`
  aspect-ratio: 1/1;
  height: 60px;
  border: 1px solid red;
  border-radius: 10px;
  background-size: cover;
`

const Slider = styled(MuiSlider)({
  color: 'primary',
  height: 4,
  width: 60,
  transition: 'all 100ms ease',
  '&:hover': {
    height: 6,
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 10,
    width: 10,
    backgroundColor: '#fff',
    transition: 'all 100ms ease',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
    '&:hover': {
      height: 15,
      width: 15,
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
})

export const Player = () => {
  const { current, prev, next } = useMusicQueue()
  const url = `https://music.163.com/song/media/outer/url?id=${current?.url}.mp3`
  const { enqueueSnackbar } = useSnackbar()

  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [muted] = useState(false)
  const [state, setState] = useState({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  })
  const [, setDuration] = useState(0)
  const player = useRef(null)
  const [loop, setLoop] = useState(false)
  const [open, setOpen] = useState(false)

  const handleReady = (player: ReactPlayer) => {
    console.log('准备去播放', player)
  }
  const handleStart = () => {
    console.log('开始播放')
  }

  const handleError = (error: any, data?: any, hlsInstance?: any, hlsGlobal?: any) => {
    console.log('发生了错误', error, data, hlsInstance, hlsGlobal)
    enqueueSnackbar('音乐加载失败，自动切换下一曲')
    next()
  }

  return (
    current && (
      <>
        <Footer>
          {/* 播放进度 */}
          <LinearProgress
            sx={{
              [`& .${linearProgressClasses.dashed}`]: {
                width: 0,
                animate: '',
              },
            }}
            variant='buffer'
            value={state.played * 100}
            valueBuffer={state.loaded * 100}
          />

          <Container
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mx: 'auto',
              height: 80,
            }}
            maxWidth='xl'
          >
            {/* 歌曲信息 */}
            <Stack sx={{ flex: '1 1 0' }} px={2} direction='row' alignItems='center' justifyContent='start' spacing={2}>
              <Cover src={current?.pictureUrl} />
              <Box>
                <Typography>{current?.name}</Typography>
                <Typography>{current?.artistList?.reduce((pre, cur) => `${pre} ${cur.name}`, '')}</Typography>
              </Box>
            </Stack>

            {/* 音乐播放控制按钮组 */}
            <Stack
              sx={{ flex: '1 1 0' }}
              px={2}
              direction='row'
              alignItems='center'
              justifyContent='center'
              spacing={2}
            >
              <IconButton onClick={prev}>
                <SkipPreviousRounded />
              </IconButton>

              <IconButton onClick={() => setPlaying(!playing)}>
                {playing ? <PauseRounded /> : <PlayArrowRounded fontSize='large' />}
              </IconButton>

              <IconButton onClick={next}>
                <SkipNextRounded />
              </IconButton>
            </Stack>

            <Stack sx={{ flex: '1 1 0' }} px={2} direction='row' alignItems='center' justifyContent='end' spacing={2}>
              {/* 是否循环 */}
              <IconButton onClick={() => setLoop(!loop)}>
                {loop ? <RepeatOneRounded color='primary' /> : <RepeatRounded />}
              </IconButton>

              {/* 音量 */}
              {volume <= 0 ? <VolumeOffRounded /> : volume <= 50 ? <VolumeDownRounded /> : <VolumeUpRounded />}
              <Slider size='small' value={volume} onChange={(_, value) => setVolume(value as number)} />

              {/* 播放列表 */}
              <IconButton onClick={() => setOpen(true)}>
                <QueueMusicRounded />
              </IconButton>
            </Stack>
          </Container>
        </Footer>

        <MusicQueue open={open} handleClose={() => setOpen(false)} />

        {/* 播放器 */}
        <ReactPlayerLazy
          ref={player}
          url={url}
          width={0}
          height={0}
          controls={false}
          playing={playing}
          config={{ file: { forceAudio: true } }}
          loop={loop}
          volume={volume / 100}
          muted={muted}
          onReady={handleReady}
          onStart={handleStart}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => next()}
          onError={handleError}
          onProgress={setState}
          onDuration={setDuration}
        />
      </>
    )
  )
}

/**
 * 播放列表
 * @param open
 * @param handleClose
 * @constructor
 */
const MusicQueue = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const { current, items } = useMusicQueue()

  return (
    <Drawer
      open={open}
      anchor='bottom'
      sx={{
        '& .MuiPaper-root': {
          height: '100vh',
          backdropFilter: `blur(20px) saturate(180%)`,
          backgroundColor: `rgba(255, 255, 255, 0.85)`,
        },
      }}
      onClose={handleClose}
    >
      <Scrollbar>
        <Container
          maxWidth='xl'
          sx={{
            px: 1,
            mx: 'auto',
            pb: '80px',
          }}
          className='py-24 px-2 mx-auto xl:container'
        >
          <Stack sx={{ position: 'sticky', top: 0 }} justifyContent='end' direction='row' p={2} alignItems='center'>
            <IconButton onClick={handleClose}>
              <ExpandMoreRounded />
            </IconButton>
          </Stack>
          <RowHeader title='播放列表' />

          <MusicList current={current} items={items} />
        </Container>
      </Scrollbar>
    </Drawer>
  )
}
