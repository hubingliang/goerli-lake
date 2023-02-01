import './globals.css';
import { AppWrapper } from './includes/AppWrapper';
import { Navbar } from './includes/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className='min-h-screen'>
        <AppWrapper>
          <Navbar></Navbar>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
