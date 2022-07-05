import { Link } from 'src/components/link'
import { useRouter } from 'next/router'
import { Avatar, ButtonBase, Container, Stack, styled, Typography } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { MenuItemUnstyled, MenuUnstyled, PopperUnstyled } from '@mui/base'
import { useUser } from 'src/utils/hook'
import { useSnackbar } from 'notistack'

type NavProps = {
  items: {
    name: string
    path: string
  }[]
}

const Header = styled('header')`
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  backdrop-filter: blur(20px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.8);
`
/**
 * 标题组件
 * @param title
 * @constructor
 */
const Title = ({ title }: { title: string }) => {
  return (
    <Stack
      sx={{
        flex: '1 1 0',
      }}
    >
      <Typography
        variant='h3'
        sx={{
          fontWeight: 'bolder',
          background: 'linear-gradient(to right, #9708cc, #43cbff)',
          color: 'transparent',
          // backgroundSize: '',
          backgroundClip: 'text',
        }}
      >
        {title}
      </Typography>
    </Stack>
  )
}

const Nav = ({ items }: NavProps) => {
  const { pathname } = useRouter()
  // console.log(pathname)

  return (
    <Stack
      direction='row'
      sx={{
        flex: '1 1 0',
      }}
      spacing={1}
      justifyContent='center'
    >
      {items.map((item) => (
        // <Link href={item.path} key={item.path}>
        <ButtonBase
          sx={{
            color: item.path === pathname ? '#335eea' : '',
            cursor: 'pointer',
            fontSize: 20,
            aspectRatio: '16 / 9',
            fontWeight: 'bold',
            px: 2,
            borderRadius: 2,
            // border: '1px solid red',
            '&:hover': {},
          }}
          key={item.path}
          component={Link}
          href={item.path}
        >
          {item.name}
        </ButtonBase>
      ))}
    </Stack>
  )
}

const MenuBox = styled(`ul`)(({ theme }) => ({
  listStyle: 'none',
  padding: 8,
  boxShadow: `${theme.shadows[1]}`,
  backdropFilter: `blur(20px) saturate(180%)`,
  borderRadius: 5,
  backgroundColor: `rgba(255, 255, 255, 0.85)`,
}))

const MenuItem = styled(MenuItemUnstyled)(({ theme }) => ({
  listStyle: 'none',
  '&:focus-visible': {
    outline: 'none',
  },
  '&:hover': {
    cursor: 'pointer',
    background: 'white',
  },
}))

const Popper = styled(PopperUnstyled)(({ theme }) => ({
  zIndex: `${theme.zIndex.drawer}`,
}))
const Right = () => {
  const { push } = useRouter()
  const { user, clearToken, isLogin } = useUser()
  const { enqueueSnackbar } = useSnackbar()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    setAnchorEl(null)
    await clearToken()
    enqueueSnackbar('登出成功')
    await push('/login')
  }

  const handleLogin = async () => {
    await push('/login')
  }

  return (
    <>
      <Stack
        sx={{
          flex: '1 1 0%',
        }}
        direction='row'
        justifyContent='end'
      >
        <Avatar component={ButtonBase} onClick={handleClick} src={user?.avatarUrl} alt={user?.nickname} />
      </Stack>
      <MenuUnstyled
        anchorEl={anchorEl}
        open={open}
        components={{ Root: Popper, Listbox: MenuBox }}
        onClose={handleClose}
      >
        {isLogin ? <MenuItem onClick={handleLogout}>登出</MenuItem> : <MenuItem onClick={handleLogin}>登陆</MenuItem>}
      </MenuUnstyled>
    </>
  )
}

/**
 * 顶部
 * @constructor
 */
export const AppHeader = () => {
  return (
    <Header sx={{ zIndex: 'appBar' }}>
      <Container
        maxWidth='xl'
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          height: 80,
          zIndex: 'appBar',
        }}
      >
        <Title title='XX音乐' />
        <Nav
          items={[
            { name: '主页', path: '/' },
            { name: '发现', path: '/explore' },
            { name: '我的', path: '/user' },
          ]}
        />
        <Right />
      </Container>
      <div className='flex justify-between items-center px-2 mx-auto  h-20 lg:container' />
    </Header>
  )
}
