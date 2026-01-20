import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { ToastProvider } from "@/components/ui";
import PageTransition from "@/components/PageTransition";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      <BookingProvider>
        <ContentProvider>
          <LanguageProvider>
            <ToastProvider>
              <PageTransition>
                <Component {...pageProps} />
              </PageTransition>
            </ToastProvider>
          </LanguageProvider>
        </ContentProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
