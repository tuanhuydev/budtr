import type { i18n } from 'i18next';
import { useEffect, useState } from 'react';

import { useShellService } from './useShellService';

// Define your budtr-specific translations
const budtrTranslations = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create New',
      noRows: 'No rows',
      label: 'Label',
      startDate: 'Start Date',
      endDate: 'End Date',
    },
    tabs: {
      overview: 'Overview',
      expense: 'Expense',
      budgets: 'Budgets',
    },
    overview: {
      dailySpends: 'Daily Spends',
      dailyMoneyMix: 'Daily Money Mix',
      weeklyMoneyMix: 'Weekly Money Mix',
      monthlyMoneyMix: 'Monthly Money Mix',
      todayMoneyMix: 'Money Mix',
      weekMoneyMix: 'Money Mix',
      monthMoneyMix: 'Money Mix',
      yearMoneyMix: 'Money Mix',
      customMoneyMix: 'Money Mix',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisYear: 'This Year',
      custom: 'Custom',
      expenseList: 'Expense List',
      noExpenses: 'No expenses found',
      selectBudget: 'Select budget',
      noBudgetsAvailable: 'No budgets available',
      weeklyComparison: 'Weekly Comparison',
      previousWeek: 'Previous Week',
      currentWeek: 'Current Week',
      noData: 'No data available',
    },
    expenses: {
      INCOME: 'Income',
      EXPENSE: 'Expense',
      FIXED: 'Fixed',
      VARIABLE: 'Variable',
      title: 'Expenses Table',
      id: 'ID',
      amount: 'Amount',
      category: 'Category',
      behavior: 'Behavior',
      createdAt: 'Created At',
      date: 'Date',
      description: 'Description',
      actions: 'Actions',
      editExpense: 'Edit Expense',
      createExpense: 'Create New Expense',
      confirmDelete: 'Confirm Delete',
      deleteConfirmMessage:
        'Are you sure you want to delete this expense? This action cannot be undone.',
      source: 'Source',
      currency: 'Currency',
      type: 'Type',
      noDescription: 'No description',
      updateSuccess: 'Expense updated successfully',
      deleteSuccess: 'Expense deleted successfully',
      updateFailed: 'Failed to update expense',
      deleteFailed: 'Failed to delete expense',
      createSuccess: 'Expense created successfully',
      createFailed: 'Failed to create expense',
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
    common: {
      save: 'Lưu',
      cancel: 'Hủy',
      edit: 'Sửa',
      delete: 'Xóa',
      create: 'Tạo mới',
      noRows: 'Không có dữ liệu',
      label: 'Nhãn',
      startDate: 'Ngày bắt đầu',
      endDate: 'Ngày kết thúc',
    },
    tabs: {
      overview: 'Tổng quan',
      expense: 'Chi tiêu',
      budgets: 'Ngân sách',
    },
    overview: {
      dailySpends: 'Chi tiêu hàng ngày',
      dailyMoneyMix: 'Phân bổ chi tiêu',
      weeklyMoneyMix: 'Phân bổ chi tiêu tuần',
      monthlyMoneyMix: 'Phân bổ chi tiêu tháng',
      todayMoneyMix: 'Phân bổ chi tiêu',
      weekMoneyMix: 'Phân bổ chi tiêu',
      monthMoneyMix: 'Phân bổ chi tiêu',
      yearMoneyMix: 'Phân bổ chi tiêu',
      customMoneyMix: 'Phân bổ chi tiêu',
      today: 'Hôm nay',
      thisWeek: 'Tuần này',
      thisMonth: 'Tháng này',
      thisYear: 'Năm này',
      custom: 'Tùy chỉnh',
      expenseList: 'Thống kê chi tiêu',
      noExpenses: 'Không có chi tiêu',
      selectBudget: 'Chọn ngân sách',
      noBudgetsAvailable: 'Không có ngân sách',
      weeklyComparison: 'So sánh theo tuần',
      previousWeek: 'Tuần trước',
      currentWeek: 'Tuần này',
      noData: 'Không có dữ liệu',
    },
    expenses: {
      INCOME: 'Thu nhập',
      EXPENSE: 'Chi tiêu',
      FIXED: 'Cố định',
      VARIABLE: 'Đột xuất',
      title: 'Bảng chi tiêu',
      id: 'ID',
      amount: 'Số tiền',
      category: 'Danh mục',
      behavior: 'Hành vi chi tiêu',
      createdAt: 'Ngày tạo',
      date: 'Ngày',
      description: 'Mô tả',
      actions: 'Hành động',
      editExpense: 'Sửa chi tiêu',
      createExpense: 'Tạo chi tiêu mới',
      confirmDelete: 'Xác nhận xóa',
      deleteConfirmMessage:
        'Bạn có chắc chắn muốn xóa chi tiêu này? Hành động này không thể hoàn tác.',
      source: 'Nguồn',
      currency: 'Tiền tệ',
      type: 'Loại',
      noDescription: 'Không có mô tả',
      updateSuccess: 'Cập nhật chi tiêu thành công',
      deleteSuccess: 'Xóa chi tiêu thành công',
      updateFailed: 'Cập nhật chi tiêu thất bại',
      deleteFailed: 'Xóa chi tiêu thất bại',
      createSuccess: 'Tạo chi tiêu thành công',
      createFailed: 'Tạo chi tiêu thất bại',
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
