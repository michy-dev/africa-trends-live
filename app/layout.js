export const metadata = {
  title: 'Africa Music Trends',
  description: 'Live trends dashboard for African music, podcasts & audiobooks',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}