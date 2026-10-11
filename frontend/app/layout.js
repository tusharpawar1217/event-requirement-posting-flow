import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Requirement Posting Flow",
  description: "Post your event requirements easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2B313A',
                color: '#D4AA98',
                border: '1px solid #4E5D68',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
