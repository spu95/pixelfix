import '@mantine/core/styles.css';
import './global.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { Navbar } from '@/components/Navbar/Navbar';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any; }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className='h-full'>
        <MantineProvider theme={theme}>
          <div className="flex gap-4">
            <Navbar />
            <div>
              {children}
            </div>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
