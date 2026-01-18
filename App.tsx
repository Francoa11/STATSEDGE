import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dock } from './components/Dock';
import { ChatWidget } from './components/ChatWidget';
import { ValueBetPro } from './screens/ValueBetPro';
import { ProAnalyst } from './screens/ProAnalyst';
import { GoldPick } from './screens/GoldPick';
import { EliteSyndicate } from './screens/EliteSyndicate';
import { RiskManager } from './screens/RiskManager';
import { AuthScreen } from './screens/AuthScreen';
import { supabase } from './services/supabaseClient';
import { Screen } from './types';

import { LandingPage } from './screens/LandingPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const [loading, setLoading] = React.useState(true);
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
    }, []);

    if (loading) return null; // Or a spinner
    if (!user) return <AuthScreen />; // Or redirect to /auth
    return children;
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <div className="flex flex-col md:flex-row h-screen w-full bg-[#0F172A] overflow-hidden">
                {/* Mobile: Content first, Dock last (bottom). Desktop: Dock first (left), Content last */}
                <div className="flex-1 relative h-full overflow-hidden flex flex-col order-1 md:order-2">
                    <ChatWidget />
                    <Routes>
                        <Route path={Screen.Landing} element={<LandingPage />} />
                        <Route path={Screen.Auth} element={<AuthScreen />} />
                        <Route path={Screen.ValueBetPro} element={<ValueBetPro />} />

                        {/* Protected Routes */}
                        <Route path={Screen.ProAnalyst} element={<ProtectedRoute><ProAnalyst /></ProtectedRoute>} />
                        <Route path={Screen.GoldPick} element={<GoldPick />} />
                        <Route path={Screen.Syndicate} element={<ProtectedRoute><EliteSyndicate /></ProtectedRoute>} />
                        <Route path={Screen.RiskManager} element={<ProtectedRoute><RiskManager /></ProtectedRoute>} />
                    </Routes>
                </div>
                <div className="flex-none z-50 order-2 md:order-1">
                    <Dock />
                </div>
            </div>
        </HashRouter>
    );
};

export default App;