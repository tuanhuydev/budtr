import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, MenuItem } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormAmountInput } from '@/components/form/FormAmountInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextField } from '@/components/form/FormTextField';
import { useBudtrTranslation } from '@/hooks/useI18n';
import { Asset, AssetType } from '@/types/asset';

const buildSchema = (msgs: {
  nameRequired: string;
  typeRequired: string;
  balanceInvalid: string;
}) =>
  z.object({
    name: z.string().min(1, msgs.nameRequired),
    type: z
      .string()
      .refine(
        v => Object.values(AssetType).includes(v as AssetType),
        msgs.typeRequired
      ),
    currentBalance: z
      .string()
      .min(1, msgs.balanceInvalid)
      .refine(
        v => !Number.isNaN(Number(v)) && Number(v) > 0,
        msgs.balanceInvalid
      ),
    currency: z.string(),
  });

type AssetFormValues = z.infer<ReturnType<typeof buildSchema>>;

export type AssetSaveData = {
  name: string;
  type: AssetType;
  currentBalance: number;
  currency: string;
};

interface AssetFormProps {
  asset?: Asset | null;
  onSave: (data: AssetSaveData) => void;
  onCancel: () => void;
}

export const AssetForm = ({ asset, onSave, onCancel }: AssetFormProps) => {
  const { t } = useBudtrTranslation();

  const schema = useMemo(
    () =>
      buildSchema({
        nameRequired: t('assets.nameRequired'),
        typeRequired: t('assets.typeRequired'),
        balanceInvalid: t('assets.currentBalanceInvalid'),
      }),
    [t]
  );

  const { control, handleSubmit, reset } = useForm<AssetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: asset?.name ?? '',
      type: asset?.type ?? '',
      currentBalance: asset ? String(asset.currentBalance) : '',
      currency: 'VND',
    },
  });

  useEffect(() => {
    reset({
      name: asset?.name ?? '',
      type: asset?.type ?? '',
      currentBalance: asset ? String(asset.currentBalance) : '',
      currency: 'VND',
    });
  }, [asset, reset]);

  const onSubmit = (values: AssetFormValues) => {
    onSave({
      name: values.name.trim(),
      type: values.type as AssetType,
      currentBalance: Number(values.currentBalance),
      currency: values.currency,
    });
  };

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
    >
      <FormTextField
        name='name'
        control={control}
        label={t('assets.assetName')}
        variant='outlined'
        fullWidth
      />
      <FormSelect name='type' control={control} label={t('assets.assetType')}>
        {Object.values(AssetType).map(typeValue => (
          <MenuItem key={typeValue} value={typeValue}>
            {t(`assets.type.${typeValue}`)}
          </MenuItem>
        ))}
      </FormSelect>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormAmountInput
          name='currentBalance'
          control={control}
          label={t('assets.currentBalance')}
          sx={{ flex: 1 }}
        />
        <FormTextField
          name='currency'
          control={control}
          label={t('assets.currency')}
          disabled
          sx={{ width: 80 }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button variant='text' color='primary' type='button' onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type='submit' variant='contained'>
          {t('common.save')}
        </Button>
      </Box>
    </Box>
  );
};
