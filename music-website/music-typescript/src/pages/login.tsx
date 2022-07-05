import * as yup from 'yup'
import { FormikValues, useFormik } from 'formik'
import { Button, FormControl, Stack, TextField } from '@mui/material'
import { useMutation } from 'react-query'
import { ajax } from 'src/utils/ajax'
import { useSnackbar } from 'notistack'
import { useUser } from 'src/utils/hook'
import { useRouter } from 'next/router'
import { useEffectOnce } from 'react-use'

/**
 * 登陆表单
 * @constructor
 */
const LoginPage = () => {
  // 处理登陆
  const { mutateAsync, isLoading } = useMutation(
    async (user: FormikValues) =>
      await ajax<string>(`login`, {
        method: 'POST',
        data: user,
      })
  )
  const { enqueueSnackbar } = useSnackbar()
  const { user, setToken } = useUser()
  const { push } = useRouter()

  useEffectOnce(() => {
    if (user) {
      push('/user').then()
    }
  })

  const formik = useFormik({
    initialValues: {
      username: 'test',
      password: '123456',
    },
    validationSchema: yup.object({
      username: yup.string().required('用户名不能为空'),
      password: yup.string().required('密码不能为空'),
    }),
    onSubmit: async (values) => {
      const result = await mutateAsync(values)
      enqueueSnackbar(result.msg)

      if (result.code === 200) {
        setToken(result.data)
        await push('/user')
      }
    },
  })

  return (
    <Stack justifyContent='center' alignItems='center' sx={{ width: 400, mx: 'auto', pt: 10 }}>
      <h2>用户登陆</h2>
      {!user && (
        <>
          <FormControl sx={{ my: 2 }} fullWidth>
            <TextField
              name='username'
              label='用户名'
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </FormControl>
          <FormControl sx={{ my: 2 }} fullWidth>
            <TextField
              name='password'
              label='密码'
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </FormControl>

          <Button variant='outlined' onClick={() => formik.handleSubmit()} fullWidth>
            {isLoading ? '登陆中' : '登陆'}
          </Button>
        </>
      )}
    </Stack>
  )
}

export default LoginPage
