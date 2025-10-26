import { useEffect, useState } from 'react';
import './history.css';

const History = () => {
    const username = localStorage.getItem('username');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://annasamarpan-backend.onrender.com/api/food/history?username=${username}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    setHistory(Array.isArray(data) ? data : []);
                } else {
                    const errorData = await response.json();
                    setError(errorData.msg || 'Failed to fetch history');
                }
            } catch (error) {
                console.log("Error in fetching:", error);
                setError('An error occurred while fetching history.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [username]);

    return (
        <div className="history-container">
        <h2>Food History</h2>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>{error}</p>
        ) : history.length > 0 ? (
            history.map((foodEntry, index) => (
                <div key={index} className="date-section">
                    <h3>{foodEntry.date_time ? new Date(foodEntry.date_time).toLocaleDateString() : 'Date not available'}</h3>
                    <div className="meal-cards">
                        {foodEntry.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="meal-card">
                                <div className="meal-type">{meal.mealType}</div>
                                <ul>
                                    {meal.food_items.map((item, idx) => (
                                        <li key={idx}>
                                            <span className="food-name">{item.food_name}</span>
                                            <span className="quantity">{item.quantity} Plates</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        ) : (
            <p>No food history available.</p>
        )}
    </div>
    
    );
};

export default History;
