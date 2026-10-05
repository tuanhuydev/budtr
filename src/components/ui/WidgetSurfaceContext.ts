import { createContext, useContext } from 'react';

export type WidgetSurface = 'outlined' | 'flat';

// Default stays 'outlined' so widgets mounted standalone by the shell keep
// their border. The Overview grid provides 'flat'.
export const WidgetSurfaceContext = createContext<WidgetSurface>('outlined');

export const useWidgetSurface = () => useContext(WidgetSurfaceContext);
