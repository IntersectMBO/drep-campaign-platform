'use client'
import Footer from "@/components/atoms/Footer";
import Header from "@/components/atoms/Header";
import { ChooseWalletModal } from "@/components/organisms";
import { useDRepContext } from "@/context/drepContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {isWalletListModalOpen}=useDRepContext()
  return (
    <html lang="en">
      <body>
        <Header />
        {isWalletListModalOpen && <ChooseWalletModal />}
        {children}
        <Footer />
      </body>
    </html>
  );
}
