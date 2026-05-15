import { Bounce } from 'react-toastify'

import type { ToastContainerProps, ToastPosition } from 'react-toastify'
import type { ToastMessages } from '@core/hooks/useAction/types'

export const toastContainerConfig: ToastContainerProps = {
          position: 'top-right' as ToastPosition,
          hideProgressBar: false,
          pauseOnFocusLoss: true,
          transition: Bounce,
          pauseOnHover: true,
          closeOnClick: false,
          newestOnTop: false,
          autoClose: 5000,
          draggable: true,
          theme: 'light',
          rtl: false,
}

export const defaultToastMessages: ToastMessages = {
          success: 'Requisição realizada com sucesso',
          pending: 'Inicializando requisição',
          error: 'Erro na requisição',
}