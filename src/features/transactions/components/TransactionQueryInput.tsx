import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Chip,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBudtrTranslation } from '@/hooks/useI18n';

import { getQuerySuggestions } from '../utils/getQuerySuggestions';
import {
  hasUnclosedQuote,
  parseTransactionQuery,
  tokenizeQuery,
} from '../utils/parseTransactionQuery';

interface TransactionQueryInputProps {
  /** Called with the effective query string whenever chips or live text change. */
  onQueryChange: (query: string) => void;
}

/**
 * Single search box for the compact `key:value` filter syntax. Committed
 * tokens render as removable chips; the parsing itself lives in
 * `utils/parseTransactionQuery`.
 */
export const TransactionQueryInput = ({
  onQueryChange,
}: TransactionQueryInputProps) => {
  const { t } = useBudtrTranslation();
  const [tokens, setTokens] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Plain text applies live while typing; a facet still being typed
  // (`category:fo`) is held back until it is committed as a chip.
  useEffect(() => {
    const pending = inputValue.trim();
    const live =
      pending && !pending.includes(':') && !hasUnclosedQuote(pending)
        ? pending
        : '';
    onQueryChange([...tokens, live].filter(Boolean).join(' '));
  }, [tokens, inputValue, onQueryChange]);

  const options = useMemo(() => getQuerySuggestions(inputValue), [inputValue]);

  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, next: string, reason: string) => {
      if (reason !== 'input') {
        setInputValue(next);
        return;
      }
      const parts = tokenizeQuery(next);
      if (!parts.length) {
        setInputValue('');
        return;
      }
      // A trailing space (outside quotes) completes the last token; pasted
      // multi-token text commits everything except the token being typed.
      const lastIsOpen = !/\s$/.test(next) || hasUnclosedQuote(next);
      const complete = lastIsOpen ? parts.slice(0, -1) : parts;
      if (complete.length) setTokens(prev => [...prev, ...complete]);
      setInputValue(lastIsOpen ? parts[parts.length - 1] : '');
    },
    []
  );

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, next: string[], reason: string) => {
      if (next.length <= tokens.length) {
        setTokens(next);
        return;
      }
      const added = next.slice(tokens.length).flatMap(tokenizeQuery);
      // Picking a facet key (`category:`) continues typing instead of
      // committing an empty filter.
      if (
        reason === 'selectOption' &&
        added.length === 1 &&
        added[0].endsWith(':')
      ) {
        setInputValue(added[0]);
        return;
      }
      setTokens(prev => [...prev, ...added]);
      setInputValue('');
    },
    [tokens.length]
  );

  return (
    <Autocomplete
      multiple
      freeSolo
      size='small'
      options={options}
      value={tokens}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      filterOptions={options => options}
      sx={rootSx}
      renderValue={(value, getItemProps) =>
        value.map((raw, index) => {
          const { key, ...itemProps } = getItemProps({ index });
          const token = parseTransactionQuery(raw).tokens[0];
          const isInvalid = !!token && !token.valid;
          const chip = (
            <Chip
              key={key}
              {...itemProps}
              size='small'
              label={raw}
              color={chipColor(token?.kind, token?.negated, isInvalid)}
              variant={token?.kind === 'facet' ? 'filled' : 'outlined'}
            />
          );
          return isInvalid ? (
            <Tooltip key={key} title={t('transactions.searchInvalidFilter')}>
              {chip}
            </Tooltip>
          ) : (
            chip
          );
        })
      }
      renderInput={params => (
        <TextField
          {...params}
          label={t('transactions.searchLabel')}
          placeholder={
            tokens.length ? undefined : t('transactions.searchPlaceholder')
          }
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position='start'>
                    <Tooltip title={t('transactions.searchHint')}>
                      <InfoOutlinedIcon fontSize='small' color='action' />
                    </Tooltip>
                    <SearchIcon fontSize='small' color='action' />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

const chipColor = (
  kind: 'facet' | 'text' | undefined,
  negated: boolean | undefined,
  invalid: boolean
) => {
  if (invalid) return 'warning';
  if (kind === 'facet') return negated ? 'error' : 'primary';
  return 'default';
};

const rootSx = {
  flex: 1,
  minWidth: { xs: '100%', md: 320 },
  '& .MuiOutlinedInput-root': { backgroundColor: 'white' },
};
