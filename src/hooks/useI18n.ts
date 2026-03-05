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
      transactions: 'Transactions',
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
      transactionList: 'Transaction List',
      noTransactions: 'No transactions found',
      selectBudget: 'Select budget',
      noBudgetsAvailable: 'No budgets available',
      weeklyComparison: 'Weekly Comparison',
      previousWeek: 'Previous Week',
      currentWeek: 'Current Week',
      currentWeekTransactions: 'Current Week Transactions',
      topTransactions: 'Top 5 Transactions',
      noData: 'No data available',
    },
    days: {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
    },
    transactions: {
      INCOME: 'Income',
      EXPENSE: 'Expense',
      FIXED: 'Fixed',
      VARIABLE: 'Variable',
      title: 'Transactions Table',
      id: 'ID',
      amount: 'Amount',
      category: 'Category',
      behavior: 'Behavior',
      createdAt: 'Created At',
      date: 'Date',
      description: 'Description',
      actions: 'Actions',
      editTransaction: 'Edit Transaction',
      createTransaction: 'Create New Transaction',
      confirmDelete: 'Confirm Delete',
      deleteConfirmMessage:
        'Are you sure you want to delete this transaction? This action cannot be undone.',
      source: 'Source',
      currency: 'Currency',
      type: 'Type',
      noDescription: 'No description',
      updateSuccess: 'Transaction updated successfully',
      deleteSuccess: 'Transaction deleted successfully',
      updateFailed: 'Failed to update transaction',
      deleteFailed: 'Failed to delete transaction',
      createSuccess: 'Transaction created successfully',
      createFailed: 'Failed to create transaction',
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
      transactions: 'Giao dịch',
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
      transactionList: 'Danh sách giao dịch',
      noTransactions: 'Không có giao dịch',
      selectBudget: 'Chọn ngân sách',
      noBudgetsAvailable: 'Không có ngân sách',
      weeklyComparison: 'So sánh theo tuần',
      previousWeek: 'Tuần trước',
      currentWeek: 'Tuần này',
      currentWeekTransactions: 'Giao dịch tuần này',
      topTransactions: 'Top 5 giao dịch',
      noData: 'Không có dữ liệu',
    },
    days: {
      sunday: 'Chủ nhật',
      monday: 'Thứ hai',
      tuesday: 'Thứ ba',
      wednesday: 'Thứ tư',
      thursday: 'Thứ năm',
      friday: 'Thứ sáu',
      saturday: 'Thứ bảy',
    },
    transactions: {
      INCOME: 'Thu nhập',
      EXPENSE: 'Chi tiêu',
      FIXED: 'Cố định',
      VARIABLE: 'Đột xuất',
      title: 'Bảng giao dịch',
      id: 'ID',
      amount: 'Số tiền',
      category: 'Danh mục',
      behavior: 'Hành vi giao dịch',
      createdAt: 'Ngày tạo',
      date: 'Ngày',
      description: 'Mô tả',
      actions: 'Hành động',
      editTransaction: 'Sửa giao dịch',
      createTransaction: 'Tạo giao dịch mới',
      confirmDelete: 'Xác nhận xóa',
      deleteConfirmMessage:
        'Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác.',
      source: 'Nguồn',
      currency: 'Tiền tệ',
      type: 'Loại',
      noDescription: 'Không có mô tả',
      updateSuccess: 'Cập nhật giao dịch thành công',
      deleteSuccess: 'Xóa giao dịch thành công',
      updateFailed: 'Cập nhật giao dịch thất bại',
      deleteFailed: 'Xóa giao dịch thất bại',
      createSuccess: 'Tạo giao dịch thành công',
      createFailed: 'Tạo giao dịch thất bại',
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
