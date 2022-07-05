import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { useUser } from 'src/utils/hook'
import { PlaylistTagType, PlaylistType } from 'src/types/entity'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { Scrollbar } from 'src/components/scrollbar'

export type CommonDialogProps = { open: boolean; handleClose: () => void }

/**
 * 描述对话框
 * @param open
 * @param handleClose
 * @param description
 * @constructor
 */
export const DescriptionDialog = ({ open, handleClose, description }: CommonDialogProps & { description: string }) => {
  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogContentText sx={{ textIndent: '2rem' }} p={2}>
        {description}
      </DialogContentText>
    </Dialog>
  )
}

/**
 * 删除歌单对话框
 * @param id 歌单编号
 * @param endpoint
 * @param open
 * @param handleClose
 * @constructor
 */
export const DeleteDialog = ({
  id,
  endpoint,
  open,
  handleClose,
}: CommonDialogProps & { id: string; endpoint: string }) => {
  const { token } = useUser()
  const { enqueueSnackbar } = useSnackbar()
  const { push } = useRouter()
  const { mutateAsync } = useMutation(
    async (id: string) =>
      await ajax(endpoint, {
        method: 'DELETE',
        data: id,
        token,
      })
  )
  const handleDelete = async () => {
    const result = await mutateAsync(id)
    enqueueSnackbar(result.msg)
    handleClose()
    await push('/user')
  }

  return (
    <Dialog open={open}>
      <DialogTitle>危险操作</DialogTitle>
      <DialogContent>
        <Typography>确认要删除么？</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleClose()}>
          我再想想
        </Button>
        <Button onClick={handleDelete} color='warning'>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/**
 * 添加到我的收藏对话框
 */
export const CollectionDialog = ({ songs, open, handleClose }: CommonDialogProps & { songs: string[] }) => {
  const { user, token } = useUser()
  const { enqueueSnackbar } = useSnackbar()
  const { data: playlistResult } = useQuery(
    ['user', 'playlist', user?.uuid],
    async () =>
      await ajax<PlaylistType[]>('user/playlists', {
        data: {
          id: user?.uuid,
        },
        token,
      }),
    {
      enabled: Boolean(user),
    }
  )
  const { mutateAsync } = useMutation(
    async ({ songs, id }: { songs: string[]; id: string }) =>
      await ajax(`playlist/songs?id=${id}`, {
        method: 'POST',
        data: songs,
        token,
      })
  )

  const handleOldPlaylist = async (id: string) => {
    const result = await mutateAsync({ songs, id })
    enqueueSnackbar(result.msg)
    handleClose()
  }

  console.log(playlistResult)

  const playlists = playlistResult?.data
  if (!playlists) return <></>

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>请选择要添加的歌单</DialogTitle>
      <Scrollbar autoHeightMax='50vh' autoHeightMin='10vh'>
        <List>
          {playlists.length < 1 ? (
            <DialogContentText textAlign='center'>暂无歌单，请先添加歌单</DialogContentText>
          ) : (
            playlists.map((playlist) => (
              <ListItemButton onClick={() => handleOldPlaylist(playlist.uuid)} key={playlist.uuid} divider>
                <ListItemAvatar>
                  <Avatar src={playlist.pictureUrl} />
                </ListItemAvatar>
                <ListItemText>{playlist.name}</ListItemText>
              </ListItemButton>
            ))
          )}
        </List>
      </Scrollbar>
    </Dialog>
  )
}

/**
 * 创建歌单对话框
 * @param open
 * @param handleClose
 * @constructor
 */
export const CreatePlaylistDialog = ({ open, handleClose }: CommonDialogProps) => {
  const { reload } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { user, token } = useUser()

  const { data: tagResult } = useQuery(
    ['playlists', 'tags'],
    async () => await ajax<PlaylistTagType[]>('playlists/tags')
  )
  const tags = tagResult?.data

  const { mutateAsync } = useMutation((values: object) =>
    ajax('playlist', {
      method: 'POST',
      data: values,
      token,
    })
  )
  const id = user?.uuid
  const formik = useFormik({
    initialValues: {
      name: '',
      pictureUrl: 'https://p1.music.126.net/OB_e-XhmqohxZA95uS2n1g==/109951167307194623.jpg',
      description: '',
      user: id,
      songs: [],
      tags: [],
    },
    validationSchema: yup.object({
      name: yup.string().required('歌单名字不能为空'),
      pictureUrl: yup.string().required('歌单封面不能为空'),
      description: yup.string().required('歌单描述不能为空'),
      tags: yup.array().required('歌单标签不能为空'),
    }),
    onSubmit: async (values) => {
      console.log(values, id)
      const result = await mutateAsync({
        ...values,
        songs: JSON.stringify(values.songs),
        tags: JSON.stringify(values.tags),
        user: id,
      })
      enqueueSnackbar(result.msg)
      await reload()
    },
  })

  if (!tags) return <></>

  return (
    <Dialog open={open}>
      <DialogContent sx={{ p: 2 }}>
        <FormControl sx={{ py: 1 }} fullWidth>
          <TextField
            label='歌单名称'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </FormControl>
        <FormControl sx={{ py: 1 }} fullWidth>
          <TextField
            label='歌单描述'
            name='description'
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id='multiple-label'>歌单标签</InputLabel>
          <Select
            labelId='multiple-label'
            name='tags'
            value={formik.values.tags}
            onChange={formik.handleChange}
            error={formik.touched.tags && Boolean(formik.errors.tags)}
            multiple
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: '20vh',
                  scrollbarWidth: 'none',
                },
              },
            }}
            fullWidth
          >
            {tags.map((tag) => (
              <MenuItem key={tag.name} value={tag.name}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={() => formik.handleSubmit()}>添加</Button>
      </DialogActions>
    </Dialog>
  )
}
