import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create RTL theme
const rtlTheme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: [
      'Assistant',
      'Rubik', 
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

// RTL wrapper component
export function RTL(props) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={rtlTheme}>
        {props.children}
      </ThemeProvider>
    </CacheProvider>
  );
}