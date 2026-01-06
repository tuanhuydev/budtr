import { useEffect, useState } from 'react';
import { useShellService } from './useShellService';
import type { i18n } from 'i18next';

// Define your budtr-specific translations
const budtrTranslations = {
  en: {
    tabs: {
      overview: 'Overview',
      expense: 'Expense',
      budgets: 'Budgets',
    },
    overview: {
      dailySpends: 'Daily Spends',
      expenseStats: 'Expense Stats',
      noExpenses: 'No expenses found',
      save: 'Save',
      selectBudget: 'Select budget',
      noBudgetsAvailable: 'No budgets available',
    },
    expenses: {
      INCOME: 'Income',
      EXPENSE: 'Expense',
    },
    categories: {
      FOOD: 'Food',
      TRANSPORTATION: 'Transportation',
      ENTERTAINMENT: 'Entertainment',
      UTILITIES: 'Utilities',
      HEALTHCARE: 'Healthcare',
      EDUCATION: 'Education',
      SHOPPING: 'Shopping',
      TRAVEL: 'Travel',
      SALARY: 'Salary',
      BUSINESS: 'Business',
      INVESTMENT: 'Investment',
      OTHER: 'Other',
    },
  },
  vi: {
    tabs: {
      overview: 'Tổng quan',
      expense: 'Chi tiêu',
      budgets: 'Ngân sách',
    },
    overview: {
      dailySpends: 'Chi tiêu hàng ngày',
      expenseStats: 'Thống kê chi tiêu',
      noExpenses: 'Không có chi tiêu',
      save: 'Lưu',
      selectBudget: 'Chọn ngân sách',
      noBudgetsAvailable: 'Không có ngân sách',
    },
    expenses: {
      INCOME: 'Thu nhập',
      EXPENSE: 'Chi tiêu',
    },
    categories: {
      FOOD: 'Ăn uống',
      TRANSPORTATION: 'Di chuyển',
      ENTERTAINMENT: 'Giải trí',
      UTILITIES: 'Tiện ích',
      HEALTHCARE: 'Y tế',
      EDUCATION: 'Giáo dục',
      SHOPPING: 'Mua sắm',
      TRAVEL: 'Du lịch',
      SALARY: 'Lương',
      BUSINESS: 'Kinh doanh',
      INVESTMENT: 'Đầu tư',
      OTHER: 'Khác',
    },
  },
};

/**
 * Hook to initialize budtr translations
 * Adds budtr namespace to shell's i18n instance
 * Returns true when translations are ready
 */
export function useI18n() {
  const i18nInstance = useShellService<i18n>('i18n');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!i18nInstance) {
      console.warn('[Budtr] i18n instance not available from shell');
      setIsReady(false);
      return;
    }

    // Add budtr translations to each language
    Object.entries(budtrTranslations).forEach(([lang, translations]) => {
      // Check if already added to avoid duplicates
      if (!i18nInstance.hasResourceBundle(lang, 'budtr')) {
        i18nInstance.addResourceBundle(
          lang,
          'budtr',
          translations,
          true, // deep merge
          false // don't overwrite
        );
      }
    });

    setIsReady(true);
  }, [i18nInstance]);

  return { i18nInstance, isReady };
}

/**
 * Custom translation hook that uses shell's i18n instance
 * Use this instead of useTranslation from react-i18next
 */
export function useBudtrTranslation() {
  const { i18nInstance, isReady } = useI18n();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!i18nInstance) return;

    // Listen to language changes
    const onLanguageChanged = () => {
      forceUpdate({});
    };

    i18nInstance.on('languageChanged', onLanguageChanged);
    return () => {
      i18nInstance.off('languageChanged', onLanguageChanged);
    };
  }, [i18nInstance]);

  const t = (key: string): string => {
    if (!i18nInstance || !isReady) {
      // console.warn('[Budtr] Translation not ready:', key);
      return key;
    }

    const translated = i18nInstance.t(`budtr:${key}`);
    // console.log(`[Budtr] Translating "${key}" -> "${translated}"`);
    return translated;
  };

  return { t, isReady, i18n: i18nInstance };
}
