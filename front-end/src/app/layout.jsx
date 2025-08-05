import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'zFinder',
  description: 'Find the best university degree programs based on your Z-score',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}