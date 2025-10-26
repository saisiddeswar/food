import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../src/store/Auth';

const Dashboard = () => {
    const userType = localStorage.getItem('userType');
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        // Only navigate if the user is logged in
        if (isLoggedIn) {
            if (userType === 'NGO') {
                navigate('/ngo-dashboard');
            } else {
                navigate('/institute-dashboard');
            }
        } else {
            navigate('/login');  // Redirect to login if not logged in
        }
    }, [isLoggedIn, userType, navigate]);

    return (
        <div>
            <h2>Loading Dashboard...</h2>
        </div>
    );
}

export default Dashboard;
