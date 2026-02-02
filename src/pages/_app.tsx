import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ToastProvider, CookieConsent, SmoothScroll } from "@/components/ui";
import CursorEffect from "@/components/ui/CursorEffect";
import PageTransition from "@/components/PageTransition";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      <ToastProvider>
        <LanguageProvider>
          <ContentProvider>
            <WishlistProvider>
              <BookingProvider>
                <CursorEffect />
                <CookieConsent />
                <SmoothScroll>
                  <PageTransition>
                    <Component {...pageProps} />
                  </PageTransition>
                </SmoothScroll>
              </BookingProvider>
            </WishlistProvider>
          </ContentProvider>
        </LanguageProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
