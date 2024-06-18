import '@/styles/globals.css'
import { ThemeProvider } from '@/components/Theme-Provider'
import { AuthUserProvider } from '@/context/AuthUserContext'
import { TeamProvider } from '@/context/TeamContext';
import { Toaster } from '@/components/ui/toaster';
import { OrganizationProvider } from '@/context/OrganizationContext';

export default function App({ Component, pageProps }) {
  const PageLayout = Component.layout || (({ children }) => children);
  return (
    <AuthUserProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <OrganizationProvider>
          <TeamProvider>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
            {/* Toast notifications */}
            <Toaster />
          </TeamProvider>
        </OrganizationProvider>
      </ThemeProvider>
    </AuthUserProvider>
  );
}

