import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  assetsApi,
  CreateAssetParams,
  UpdateAssetParams,
} from '../../services/api';
import type { ApiClient } from '../../types/shell';
import { useShellService } from '../useShellService';

export const ASSETS_QUERY_KEY = 'assets';

export const useAssets = () => {
  const apiClient = useShellService<ApiClient>('apiClient');

  return useQuery({
    queryKey: [ASSETS_QUERY_KEY],
    queryFn: () => assetsApi.fetchAssets(apiClient!),
    enabled: !!apiClient,
  });
};

export const useCreateAsset = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetParams) =>
      assetsApi.createAsset(apiClient!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
    },
  });
};

export const useUpdateAsset = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAssetParams) =>
      assetsApi.updateAsset(apiClient!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
    },
  });
};

export const useDeleteAsset = () => {
  const apiClient = useShellService<ApiClient>('apiClient');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => assetsApi.deleteAsset(apiClient!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
    },
  });
};
