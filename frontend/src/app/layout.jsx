import GlobalStyle from "@/app/GlobalStyle";
import StyledComponentsRegistry from "@/lib/registry";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";

export const metadata = {
  title: "Quantix",
  description: "Web extraction platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <QueryProvider>
            <AuthProvider>
              <GlobalStyle />
              {children}
            </AuthProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
