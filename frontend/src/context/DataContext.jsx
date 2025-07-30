import {createContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
export const DataContext = createContext();

const DataProvider = ({children}) => {
    const current_user = localStorage.getItem("tumblr_user")
    const current_admin = localStorage.getItem("tumblr_admin")
    const [loggedUser, setLoggedUser] = useState({})
    const [loggedAdmin, setLoggedAdmin] = useState({})

    useEffect(()=>{
        const user = JSON.parse(current_user)
        setLoggedUser((prev) => (prev = user))
    }, [])
    useEffect(()=>{
        const admin = JSON.parse(current_admin)
        setLoggedAdmin((prev) => (prev = admin))
    }, [])

    const values={
        loggedUser,
        setLoggedUser,
        loggedAdmin,
        setLoggedAdmin
    }
    return(
        <DataContext.Provider value={values}>{children}</DataContext.Provider>
    )
}
export default DataProvider;