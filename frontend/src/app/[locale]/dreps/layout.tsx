import Footer from "@/components/atoms/Footer"
import Header from "@/components/atoms/Header"

export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
          <Header/>
            {children}
          <Footer/>
        </body>
        </html>
    )
}
