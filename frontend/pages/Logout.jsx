import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../src/store/Auth";

const Logout = () => {
    const navigate = useNavigate();
    const { LogoutUser } = useContext(AuthContext);

    useEffect(() => {
        LogoutUser();          // Clear the token and update context
        navigate('/login');    // Redirect to login page after logout
    }, [LogoutUser, navigate]); // Ensure correct dependency array

    return null; // No need to return anything as useEffect handles redirection
};

export default Logout;
