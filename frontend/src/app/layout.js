import GlobalStyle from "@/styles/GlobalStyle";

export const metadata = {
  title: "Quantix",
  description: "Web extraction platform",
};


export default function RootLayout({children}) {

  return (

    <html lang="en">

      <body>

        <GlobalStyle />

        {children}

      </body>

    </html>

  );

}