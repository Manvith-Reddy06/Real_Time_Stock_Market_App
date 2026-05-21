import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container py-10">
      {children}
    </div>
  );
};

export default Layout;