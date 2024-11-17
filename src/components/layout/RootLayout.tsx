import Footer from "./Footer";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col text-center p-5 min-h-[calc(100vh_-88px)] min-[909px]:min-h-[calc(100vh_-64px)]">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;
