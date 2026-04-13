import LayoutOne from "@/components/app-layouts/layout-one/layout-one";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutOne>
      {children}
    </LayoutOne>
  );
}
