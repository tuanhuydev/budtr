import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { useBudtrTranslation } from '@/hooks/useI18n';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteDialog = ({
  open,
  title,
  message,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) => {
  const { t } = useBudtrTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='text' color='info' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button variant='contained' color='error' onClick={onConfirm}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
