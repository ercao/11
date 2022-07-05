import { FC, MouseEventHandler, useState } from 'react'
import { Button, ButtonProps, IconButton as MuiIconButton, IconButtonProps } from '@mui/material'
import { useMutation } from 'react-query'
import { SongType } from 'src/types/entity'
import { ajax } from 'src/utils/ajax'
import { useMusicQueue, useUser } from 'src/utils/hook'
import { useSnackbar } from 'notistack'
import { CollectionDialog, CreatePlaylistDialog, DeleteDialog } from 'src/components/dialog'

export const IconButton: FC<IconButtonProps> = ({ ...props }) => {
  return <MuiIconButton {...props} />
}

export const DeleteButton: FC<ButtonProps & { endpoint: string; id: string; icon?: boolean }> = ({ id, endpoint }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button color='warning' variant='outlined' onClick={() => setOpen(true)}>
        删除
      </Button>
      <DeleteDialog open={open} handleClose={() => setOpen(false)} id={id} endpoint={endpoint} />
    </>
  )
}

export const CollectionButton: FC<ButtonProps & { songs: string[] }> = ({ songs, ...props }) => {
  const [open, setOpen] = useState(false)
  const { user } = useUser()

  if (!user) return <></>

  return (
    <>
      <Button variant='outlined' onClick={() => setOpen(true)} {...props}>
        收藏
      </Button>
      <CollectionDialog open={open} handleClose={() => setOpen(false)} songs={songs} />
    </>
  )
}

export const CreatePlaylistButton: FC<ButtonProps> = ({ ...props }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant='outlined' onClick={() => setOpen(true)} {...props}>
        创建新歌单
      </Button>
      <CreatePlaylistDialog open={open} handleClose={() => setOpen(false)} />
    </>
  )
}

/**
 * 将歌曲添加到播放列表
 * @param id
 * @param endpoint
 * @param props
 * @param icon
 * @constructor
 */
export const PlayButton: FC<ButtonProps & { endpoint: string; id: string; icon?: boolean }> = ({
  id,
  endpoint,
  icon = false,
  ...props
}) => {
  const { token } = useUser()
  const { set } = useMusicQueue()
  const { enqueueSnackbar } = useSnackbar()

  const { mutateAsync } = useMutation(
    async ({ id, endpoint }: { id: string; endpoint: string }) =>
      await ajax<SongType[]>(`${endpoint}/songs`, {
        data: { id },
        token,
      })
  )

  const handlePlaySongs: MouseEventHandler<HTMLElement> = async (event) => {
    event.stopPropagation()
    event.preventDefault()

    const result = await mutateAsync({ id, endpoint })
    const songs = result.data

    if (!songs) {
      enqueueSnackbar(result.msg)
      return
    }
    set(songs)
  }

  return (
    <>
      {icon ? (
        <IconButton title='播放' onClick={handlePlaySongs} {...props} />
      ) : (
        <Button variant='outlined' title='播放' onClick={handlePlaySongs} {...props} />
      )}
    </>
  )
}
