import { Avatar, Stack, styled } from '@mui/material'
import { MusicListType } from 'src/utils/hook'
import { Typography } from './typorgraphy'

const MusicItem = styled(Stack)(({ theme }) => ({
  padding: '10px',
  margin: '5px 0',
  borderRadius: '10px',
}))

export const MusicList = ({ current, items }: MusicListType) => {
  return (
    <>
      <Stack
        sx={{
          // border: '1px solid red',
          padding: '20px 0',
        }}
      >
        {items?.map((item) => (
          <MusicItem
            sx={{
              background: current?.uuid === item.uuid ? '#eaeffd' : '#f5f5f7',
              transition: 'all 200ms ease',
              '&:hover': {
                boxShadow: 1,
                filter: 'brightness(.98)',
              },
            }}
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            key={item.uuid}
          >
            <Stack direction='row' flex='1 1 0' alignItems='center' spacing={2}>
              <Avatar sx={{ width: '3.5rem', height: '3.5rem' }} src={item.pictureUrl} />
              <Typography fontSize={19} fontWeight='bold'>
                {item.name}
              </Typography>
            </Stack>

            <Stack direction='row' flex='1 1 0'>
              <Typography fontSize={18} sx={{ cursor: 'default' }} fontWeight='bold'>
                {item.artistList.reduce((pre, artist) => `${pre} ${artist.name}`, '')}
              </Typography>
            </Stack>
          </MusicItem>
        ))}
      </Stack>
    </>
  )
}
