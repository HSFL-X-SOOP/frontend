import {Route, Routes} from "react-router-dom";

import IndexPage from "@/pages/Index.tsx";
import {Nav} from "@/pages/Nav.tsx";
import {Nav3} from "@/pages/Nav3.tsx";
import {Nav4} from "@/pages/Nav4.tsx";
import {Nav5} from "@/pages/Nav5.tsx";
import {Profile} from "@/pages/Profile.tsx";
import {About} from "@/pages/About.tsx";
import {AuthProvider} from "@/context/SessionContext.tsx";
import {ProtectedRoute} from "@/components/ProtectedRoute.tsx";
import {Api} from "@/pages/Api.tsx";
import {Sensor} from "@/pages/Sensor.tsx";
import Login from "@/pages/Auth/Login.tsx";
import Register from "@/pages/Auth/Register.tsx";
import MagicLink from "@/pages/Auth/Magic-Link.tsx";
import OAuthCallbackHandler from "@/pages/Auth/OAuthCallbackHandler.tsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Login/>} path="/login"/>
                <Route element={<Register/>} path="/register"/>
                <Route element={<MagicLink/>} path="/magic-link"/>
                <Route element={<MagicLink/>} path="/forgot-password"/>
                <Route element={<OAuthCallbackHandler/>} path="/google/callback"/>
                <Route element={<IndexPage/>} path="/"/>
                <Route element={<Nav/>} path="/nav2"/>
                <Route element={<Nav3/>} path="/nav3"/>
                <Route element={<Nav4/>} path="/nav4"/>
                <Route element={<Nav5/>} path="/nav5"/>
                <Route element={<ProtectedRoute><Profile/></ProtectedRoute>} path="/profile"/>
                <Route element={<About/>} path="/about"/>
                <Route element={<Api/>} path="/api"/>
                <Route element={<Sensor/>} path="/sensoren"/>
            </Routes>
        </AuthProvider>
    );
}

export default App;
