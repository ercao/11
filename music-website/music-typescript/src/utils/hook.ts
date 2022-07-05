import { useCallback } from 'react'
import { SongType } from 'src/types/entity'
import useLocalStorageState from 'use-local-storage-state'
import jwtDecode from 'jwt-decode'
import { fromUnixTime, isBefore } from 'date-fns'
import { useSnackbar } from 'notistack'

type LoginUserType = {
  uuid: string
  avatarUrl: string
  nickname: string
  role: string
  exp: number
}

export const useUser = () => {
  const [token, setToken, { removeItem }] = useLocalStorageState<string>('token', {
    storageSync: true,
  })

  const { enqueueSnackbar } = useSnackbar()

  let user: null | LoginUserType = null

  if (typeof token !== 'undefined' && token !== null) {
    user = jwtDecode<LoginUserType>(token)
    if (isBefore(fromUnixTime(user.exp), new Date())) {
      enqueueSnackbar('登陆已过期')
      removeItem()
    }
  }
  return {
    isLogin: Boolean(user),
    token,
    user,
    setToken,
    clearToken: removeItem,
  }
}

// 播放列表项类型
export type MusicListType = {
  current?: SongType
  items?: SongType[]
}

export const useMusicQueue = () => {
  const [queue, setQueue, { removeItem }] = useLocalStorageState<MusicListType>('queue', {
    storageSync: true,
  })

  const set = useCallback(
    (musics: SongType[]) => {
      if (musics && musics.length < 1) removeItem()
      else {
        setQueue({ current: musics[0], items: musics })
      }
    },
    [removeItem, setQueue]
  )

  const changeCurrent = useCallback(
    (step: number) => {
      if (!queue || !queue.current || !queue.items || queue.items.length < 1) {
        return
      }

      const length = queue.items.length
      const index = (queue.items.findIndex((value) => value.uuid === queue.current?.uuid) + step + length) % length
      setQueue({ ...queue, current: queue.items.at(index) })
    },
    [queue, setQueue]
  )
  return {
    items: queue?.items,
    current: queue?.current,
    set,
    clear: removeItem,
    next: () => {
      console.log('下一曲')
      changeCurrent(1)
    },
    prev: () => {
      console.log('上一曲')
      changeCurrent(-1)
    },
  }
}
