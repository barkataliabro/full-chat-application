import {createBrowserRouter} from "react-router-dom"
import Register from "../pages/Register"
import Checkemailpage from "../pages/Checkemailpage.jsx"
import Checkpassword from "../pages/Checkpassword.jsx"
import Message from "../components/Message.jsx"
import App from "../App.jsx"
import Home from "../pages/Home.jsx"
import Authlayout from "../layout/index.jsx"
import Forgotpassword from "../pages/Forgotpassword.jsx"
const router = createBrowserRouter([

    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "register",
                element:   
                <Authlayout>
                    <Register/>
                </Authlayout>
            },
            {
                path: "email",
                element: <Authlayout><Checkemailpage/></Authlayout>
            },
            {
                path: "password",
                element: <Authlayout><Checkpassword/></Authlayout>
            },
            {
                path: "forgot-password",
                element: <Authlayout><Forgotpassword/></Authlayout>
            },
            {
                path: "",
                element: <Home/>,
                children: [
                    {
                        path: ":userId",
                        element: <Message/>
                    }
                ]
            }
        ]
    }
])


export default router