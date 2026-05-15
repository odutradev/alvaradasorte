import { Collapse, FormHelperText, IconButton, TextField } from '@mui/material'
import { Delete, Edit, PictureAsPdf, UploadFile } from '@mui/icons-material'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { CheckIcon, DescriptionText, DescriptionWrapper, FileInfoStack, FileNameText, FileRow, FileRowContent, FileRowMainLine, FileUploadWrapper, HiddenFileInput, LabelText, ObrigatoryChip, OrderBadge, SaveDescriptionButton } from './styles'
import type { FileUploadProps } from './types'

const FileUpload = ({ value, onChange, label, required, error, orderNumber, readOnly }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [draftDescription, setDraftDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDraftDescription(value?.description ?? '')
    setIsEditing(true)
    onChange({ file, description: value?.description ?? '' })
  }

  const handleRemove = () => {
    onChange(null)
    setDraftDescription('')
    setIsEditing(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleSaveDescription = () => {
    if (!value) return
    onChange({ ...value, description: draftDescription })
    setIsEditing(false)
  }

  const handleEditDescription = () => {
    setDraftDescription(value?.description ?? '')
    setIsEditing(true)
  }

  return (
    <FileUploadWrapper>
      <HiddenFileInput ref={inputRef} type="file" accept=".pdf" onChange={handleFileChange} />
      <FileRow $hasError={!!error} $hasFile={!!value && !isEditing}>
        <OrderBadge $hasFile={!!value && !isEditing}>
          {value && !isEditing ? <CheckIcon /> : orderNumber}
        </OrderBadge>
        <FileRowContent>
          <FileRowMainLine>
            <LabelText variant="body2">{label}</LabelText>
            {required && !value && (
              <ObrigatoryChip label="Obrigatório" size="small" color="warning" variant="outlined" />
            )}
            {value
              ? (
                <FileInfoStack direction="row" alignItems="center" gap={0.5}>
                  <PictureAsPdf fontSize="small" color="primary" />
                  <FileNameText variant="body2">{value.file.name}</FileNameText>
                  {!isEditing && !readOnly && (
                    <IconButton size="small" onClick={handleEditDescription} aria-label="Editar descrição">
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                  {!readOnly && (
                    <IconButton size="small" onClick={handleRemove} aria-label="Remover documento">
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </FileInfoStack>
              )
              : !readOnly && (
                <IconButton size="small" onClick={() => inputRef.current?.click()} aria-label="Anexar PDF" color="primary">
                  <UploadFile fontSize="small" />
                </IconButton>
              )
            }
          </FileRowMainLine>
          {value && !isEditing && !!value.description && (
            <DescriptionText variant="body2">{value.description}</DescriptionText>
          )}
          <Collapse in={!!value && isEditing}>
            <DescriptionWrapper>
              <TextField
                label="Descrição (opcional)"
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                multiline
                rows={2}
              />
              <SaveDescriptionButton variant="contained" size="small" onClick={handleSaveDescription}>
                Salvar
              </SaveDescriptionButton>
            </DescriptionWrapper>
          </Collapse>
        </FileRowContent>
      </FileRow>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FileUploadWrapper>
  )
}

export default FileUpload