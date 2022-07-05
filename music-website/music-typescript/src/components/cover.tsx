import { Box, Stack, StackProps, Typography, TypographyProps } from '@mui/material'
import React, { ReactNode } from 'react'
import { MUIStyledCommonProps } from '@mui/system'
import { PlayCircleOutlineRounded } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { PlayButton } from 'src/components/button'

type CoverProps = StackProps & {
  id: string
  url: string
  endpoint: string
  callback?: (id: string) => void
  playCallback?: (id: string) => Promise<void>
}

/**
 * 封面组件
 * @param id
 * @param url
 * @param sx
 * @param endpoint
 * @param props
 * @constructor
 */
export const Cover = ({ id, url, endpoint, sx = {}, ...props }: CoverProps) => {
  const { push } = useRouter()
  const handleClick = async () => {
    await push(`/${endpoint}/${id}`)
  }

  return (
    <Stack
      sx={{
        backgroundImage: `url(${url})`,
        aspectRatio: '1/1',
        position: 'relative',
        backgroundSize: 'cover',
        borderRadius: 1.5,
        transition: 'all 250ms ease',
        '&:hover': {
          boxShadow: 5,
          '& .MuiSvgIcon-root': {
            opacity: 0.8,
          },
        },
        ...sx,
      }}
      justifyContent='center'
      alignItems='center'
      onClick={handleClick}
      {...props}
    >
      <PlayButton endpoint={endpoint} id={id} icon>
        <PlayCircleOutlineRounded
          sx={{
            opacity: 0,
            cursor: 'pointer',
            backdropFilter: 'blur(20px) saturate(180%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            fontSize: '4rem',
            borderRadius: '50%',
            transitionProperty: 'opacity',
            transitionDuration: '250ms',
          }}
        />
      </PlayButton>
    </Stack>
  )
}

export type CoverRowHeaderProps = TypographyProps & {
  title: string
}
/**
 * 行标题
 * @param title
 * @param props
 * @constructor
 */
export const RowHeader = ({ title, ...props }: CoverRowHeaderProps) => {
  return (
    <Stack direction='row' justifyContent='start' alignItems='center' py={3}>
      <Typography variant='h2' fontWeight='bold' fontSize={30} {...props}>
        {title}
      </Typography>
    </Stack>
  )
}

export type CoverRowItemType = Omit<CoverProps, 'sx' | 'endpoint'> & {
  content: ReactNode
}

export type CoverRowProps = MUIStyledCommonProps & {
  endpoint: string
  column?: number
  gap?: number
  items: CoverRowItemType[]
}

export const CoverRow = ({ endpoint, items, column = 5, gap = 2, sx }: CoverRowProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${column}, 1fr)`,
          gap,
        }}
      >
        {items?.map((item) => {
          return (
            <Box key={item.id}>
              <Cover endpoint={endpoint} id={item.id} url={item.url} sx={sx} />
              <Stack py={2} justifyContent='center' alignItems='center'>
                {item.content}
              </Stack>
            </Box>
          )
        })}
      </Box>
    </>
  )
}
