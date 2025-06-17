import type { Authentication } from '@/domain'
import { authAtom, type AuthModel } from '@/presentation/atoms/authAtom'
import { useErrorHandler } from '@/presentation/hooks/use-error-handler'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { App, Button, Col, Form, Image, Input, Row, Typography } from 'antd'
import { useSetAtom, type WritableAtom } from 'jotai'
import { useState, type JSX } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
  authentication: Authentication
}

const { Title, Paragraph } = Typography

export function LoginForm({ authentication }: Props): JSX.Element {
  const { notification } = App.useApp()
  const [isCapsLockActive, setIsCapsLockActive] = useState(false)
  const setAuth = useSetAtom(authAtom as WritableAtom<AuthModel | null, [AuthModel | null], void>)
  const navigate = useNavigate()

  const handleError = useErrorHandler((error: Error) => {
    notification.error({
      message: 'Falha na tentativa de login!',
      description: error.message,
      duration: 5
    })
  })

  const onFinish = async (formData: any) => {
    try {
      const response = await authentication.auth({
        email: formData.login,
        password: formData.password
      })

      setAuth(response)
      localStorage.setItem('auth', JSON.stringify(response))

      notification.success({
        message: 'Login realizado!',
        duration: 2,
        placement: 'topRight',
        description: `Bem-vindo ${response.accountModel?.personalInformation?.nickname}!`
      })

      navigate('/home')
    } catch (error) {
      handleError(error as Error)
    }
  }

  return (
    <>
      <Row>
        <Col span='24'>
          <Row justify='center'>
            <Image
              preview={false}
              width='30%'
              height='30%'
              src='/icons/fkgrupo.svg'
            />
          </Row>
          <Title style={{ textAlign: 'center' }} level={2}>Bem-vindo!</Title>
          <Paragraph style={{ textAlign: 'center' }}>Para iniciar, entre com seu login e senha</Paragraph>
        </Col>
      </Row>

      <Row>
        <Col span='24'>
          <Form
            data-testid='form'
            autoComplete='off'
            requiredMark={false}
            colon={false}
            layout='vertical'
            name='form'
            onFinish={onFinish}
          >
            <Form.Item
              label='Login'
              name='login'
              normalize={(value: string) => value.toLowerCase()}
              rules={[
                { required: true, message: 'Preencha o login!' },
                { type: 'email', message: 'Login deve ser um e-mail válido!' }
              ]}
            >
              <Input
                type='email'
                name='login'
                data-testid='login'
                placeholder='login@email.com'
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              label='Senha'
              name='password'
              rules={[
                { required: true, message: 'Preencha a senha!' },
                { min: 5, message: 'Senha deve ter no mínimo 5 caracteres' },
                ({
                  required: false,
                  warningOnly: true,
                  async validator() {
                    if (!isCapsLockActive) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Atenção CapsLock está ativo!!'))
                  }
                })
              ]}

            >
              <Input.Password
                id='passwordInput'
                placeholder='********************'
                name='password'
                type='password'
                data-testid='password'
                prefix={<LockOutlined />}
                onKeyUp={(key) => { setIsCapsLockActive(key.getModifierState('CapsLock')) }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                block
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }} >
              <Link data-testid='forgot-link' to='forgot-password'>Esqueci minha senha</Link>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }} >
              <Button />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}
