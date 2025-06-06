import { AccessDeniedError } from '@/domain/errors/access-denied-error'
import { ViolationsError } from '@/domain/errors/violations-error'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ProfiledMessageHandler } from '../components/profiled-messages-handler'

type CallBackType = (error: Error) => void
type ResultType = CallBackType

export const useErrorHandler = (callback: CallBackType): ResultType => {
  const navigate = useNavigate()

  const { notification } = App.useApp()

  return (error: Error): void => {
    if (error instanceof AccessDeniedError && (error.message === 'Acesso negado!' || error.message === 'Access denied')) {
      notification.warning({
        message: 'Aviso',
        description: 'Sua sessão expirou!',
        duration: 5
      })
      navigate('/logout')
    } else if (error instanceof ViolationsError && error.errorBody) {
      notification.info({
        message: error.errorBody.error,
        style: { width: 'max-content' },
        description: ProfiledMessageHandler({ messages: error.errorBody.violations }),
        duration: 0
      })
    } else {
      callback(error)
    }
  }
}
