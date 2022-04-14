import type { AppProps } from 'next/app'
import { Layout, Menu } from 'antd'
import styled from '@emotion/styled'
import Link from 'next/link'
import { FunctionComponent } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import '../style/theme.css'

const Header = () => {
  const { pathname } = useRouter()

  return (
    <Layout.Header
      style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}
    >
      {/* <Link href={'/'} passHref> */}
      {/*  <GoBook */}
      {/*    style={{ */}
      {/*      height: '4rem', */}
      {/*      width: '5rem', */}
      {/*      // paddingTop: '1rem', */}
      {/*      marginRight: '1rem', */}
      {/*      color: 'rgb(0, 82, 204)', */}
      {/*    }} */}
      {/*  /> */}
      {/* </Link> */}

      <Menu mode={'horizontal'} selectedKeys={[pathname.split('/')[1]]}>
        <Menu.Item key={'book'}>
          <Link href={'/book'}>
            <a>图书</a>
          </Link>
        </Menu.Item>
        <Menu.Item key={'author'}>
          <Link href={'/author'}>
            <a>作者</a>
          </Link>
        </Menu.Item>
        <Menu.Item key={'label'}>
          <Link href={'/label'}>
            <a>标签</a>
          </Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
  )
}

const AppHeader = styled(Header)`
  display: flex;
  margin-top: 2rem;
`
const Content = styled('div')`
  padding: 1.5rem 50px;
`

const AppContent: FunctionComponent = ({ children }) => (
  <Layout.Content>
    <Content>{children}</Content>
  </Layout.Content>
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>简易图书信息管理系统</title>
        <meta charSet="utf-8" />
        <meta name="description" content="简易图书信息管理系统" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <AppHeader />
        <AppContent>
          <Component {...pageProps} />
        </AppContent>
      </Layout>
    </>
  )
}

export default MyApp
