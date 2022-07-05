import { Stack } from '@mui/material'
import type { NextPage } from 'next'
import { AlbumSection, ArtistSection, ForYouSection, PlaylistSection } from 'src/components/section'

const Home: NextPage = () => {
  return (
    <>
      <Stack direction='row' spacing={5}>
        <ForYouSection />
        <AlbumSection />
      </Stack>
      <PlaylistSection />
      <ArtistSection />
    </>
  )
}

export default Home
