import type { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    {children}
                </div>
            </main>
        </>
    );
};

export default Layout;
