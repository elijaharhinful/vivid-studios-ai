import './global.css';
import { ThemeProvider, ThemeToggle } from '@/components/theme';

export const metadata = {
  title: 'Vivid Studios AI',
  description: 'AI-powered creative studio platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
