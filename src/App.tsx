import {Route, Routes} from "react-router-dom";

import IndexPage from "@/pages/Index.tsx";
import {Nav} from "@/pages/Nav.tsx";
import {Nav3} from "@/pages/Nav3.tsx";
import {Nav4} from "@/pages/Nav4.tsx";
import {Nav5} from "@/pages/Nav5.tsx";
import {Profile} from "@/pages/Profile.tsx";

function App() {
    return (
        <Routes>
            <Route element={<IndexPage/>} path="/"/>
            <Route element={<Nav/>} path="/nav2"/>
            <Route element={<Nav3/>} path="/nav3"/>
            <Route element={<Nav4/>} path="/nav4"/>
            <Route element={<Nav5/>} path="/nav5"/>
            <Route element={<Profile/>} path="/profile"/>
        </Routes>
    );
}

export default App;
