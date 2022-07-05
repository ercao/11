import { Box, Stack } from '@mui/material'
import { useQuery } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { PlaylistType } from 'src/types/entity'
import { useRouter } from 'next/router'
import { Cover, RowHeader } from 'src/components/cover'
import { MusicList } from 'src/components/music-list'
import { useUser } from 'src/utils/hook'
import { DescriptionTypography, Typography } from 'src/components/typorgraphy'
import { CollectionButton, DeleteButton, PlayButton } from 'src/components/button'
import { format } from 'date-fns'

const PlayListPage = () => {
  const {
    query: { id },
  } = useRouter()
  const { user } = useUser()
  const { data } = useQuery(['playlist', id], async () => await ajax<PlaylistType>(`playlist`, { data: { id } }), {
    enabled: Boolean(id),
  })

  const playlist = data?.data
  if (!playlist) {
    return <></>
  }
  const auth = user && user.uuid === playlist.userEntity.uuid

  return (
    <>
      <Stack direction='row' spacing={2} py='5rem'>
        {/* 封面组件 */}
        <Cover
          id={playlist.uuid}
          url={playlist.pictureUrl}
          width='20rem'
          height='20rem'
          boxShadow={2}
          endpoint='playlist'
        />

        {/* 详细描述部分 */}
        <Box sx={{ display: 'grid', py: '1rem' }}>
          <RowHeader title={playlist.name} />
          <Typography>
            By {playlist.userEntity.nickname}
            <br />
            最后更新于{'  '}
            {format(new Date(playlist.updateTime[0], playlist.updateTime[1], playlist.updateTime[2]), 'yyyy-MM-dd')}
          </Typography>

          <DescriptionTypography text={playlist.description} />

          <Box>
            <PlayButton endpoint='playlist' id={playlist.uuid}>
              播放
            </PlayButton>

            {!user ? (
              <></>
            ) : auth ? (
              <DeleteButton endpoint='playlist' id={playlist.uuid} />
            ) : (
              <CollectionButton songs={JSON.parse(playlist.songs)} />
            )}
          </Box>
        </Box>
      </Stack>

      {/* 音乐列表 */}
      <MusicList items={playlist.songList} />
    </>
  )
}

export default PlayListPage
