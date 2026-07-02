// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../lib/auth-context";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
