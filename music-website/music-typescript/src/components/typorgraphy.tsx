import { styled, Typography as MuiTypography } from '@mui/material'
import { TypographyProps } from '@mui/system'
import React, { FC, useState } from 'react'
import { DescriptionDialog } from 'src/components/dialog'

export const Typography = styled(MuiTypography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const DescriptionTypography: FC<TypographyProps & { text: string }> = ({ text, ...props }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Typography sx={{ cursor: 'pointer' }} onClick={() => setOpen(true)} {...props}>
        {text}
      </Typography>

      {/* 描述对话框 */}
      <DescriptionDialog open={open} handleClose={() => setOpen(false)} description={text} />
    </>
  )
}

export const PlaylistTypography: FC<{ name: string; user: string }> = ({ name, user }) => {
  return (
    <>
      <Typography width='16rem' fontWeight='bold' title={name}>
        {name}
      </Typography>
      <Typography width='16rem' color='gray'>
        by {user}
      </Typography>
    </>
  )
}
