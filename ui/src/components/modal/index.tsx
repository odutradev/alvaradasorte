import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'

import { StyledDialog, ModalHeader, ModalBody, ModalFooter } from './styles'
import type { ModalProps } from './types'

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children,
  hideCloseButton = false,
  headerRight,
  paperSx,
  headerSx,
  bodySx,
  footerSx,
  disableBodyWrap = false,
  formProps,
  fullWidth = true,
  fullScreen,
  maxWidth = 'sm',
  PaperProps,
  ...dialogProps
}: ModalProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isFullScreen = fullScreen ?? isMobile
  const showHeader = Boolean(title || subtitle || (!hideCloseButton && onClose))

  const mergedPaperProps = {
    ...PaperProps,
    sx: [
      ...(Array.isArray(paperSx) ? paperSx : paperSx ? [paperSx] : []),
      ...(Array.isArray(PaperProps?.sx) ? PaperProps.sx : PaperProps?.sx ? [PaperProps.sx] : []),
      ...(isFullScreen
        ? [
            {
              width: '100% !important',
              maxWidth: '100% !important',
              height: '100% !important',
              maxHeight: '100% !important',
              margin: 0,
              borderRadius: 0
            }
          ]
        : [])
    ]
  }

  const content = (
    <>
      {showHeader && (
        <ModalHeader sx={headerSx}>
          <Box sx={{ minWidth: 0, flex: 1, pr: 2 }}>
            {typeof title === 'string' ? (
              <Typography variant="h6" fontWeight={700}>
                {title}
              </Typography>
            ) : (
              title
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              ) : (
                subtitle
              )
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {headerRight}
            {!hideCloseButton && onClose && (
              <IconButton
                onClick={(e) => onClose(e, 'backdropClick')}
                size="small"
                aria-label="fechar"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </ModalHeader>
      )}

      {disableBodyWrap ? children : <ModalBody sx={bodySx}>{children}</ModalBody>}

      {actions && <ModalFooter sx={footerSx}>{actions}</ModalFooter>}
    </>
  )

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      fullScreen={isFullScreen}
      maxWidth={maxWidth}
      PaperProps={mergedPaperProps}
      {...dialogProps}
    >
      {formProps ? (
        <Box
          component="form"
          {...formProps}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            ...formProps.sx
          }}
        >
          {content}
        </Box>
      ) : (
        content
      )}
    </StyledDialog>
  )
}

export { ModalHeader, ModalBody, ModalFooter }
export type { ModalProps }
export default Modal
