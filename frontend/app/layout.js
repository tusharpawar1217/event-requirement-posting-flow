import "./globals.css";

export const metadata = {
  title: "Requirement Posting Flow",
  description: "Post your event requirements easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
