import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../contexts/UserAuthorContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import axios from "axios";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [newUser, setnewUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (isSignedIn && isLoaded) {
        const updatedUser = {
          ...currentUser,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailAddresses[0].emailAddress,
          profileImageUrl: user.imageUrl,
        };
        setCurrentUser(updatedUser);

        try {
          const res = await axios.get("http://localhost:3003/user-api/check-user", {
            params: { email: updatedUser.email }
          });
          
          setnewUser(res.data.flag);
          // If user exists, navigate to articles
          if (!newUser) {
            const updated = {
              ...currentUser,
              role: res.data.role, // or use updated User.email if needed
            };
            setCurrentUser(updated);
            console.log(updated);
            navigate(`${res.data.role}-profile/${currentUser.email}/articles`);
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setError("Failed to verify user. Try again later.");
        }
      }
    };
    checkUser();
  }, [isSignedIn, isLoaded, user, navigate]);

  async function onSelectRole(e) {
    e.preventDefault();
    setError("");
    const selectedRole = e.target.value;
    const userWithRole = { ...currentUser, role: selectedRole };

    try {
      const res = await axios.post(`http://localhost:3003/${selectedRole}-api/${selectedRole}`, userWithRole);

      if (res.data) {
        const { message, payload } = res.data;
        if (message === selectedRole) {
          const updatedUser = { ...userWithRole, ...payload };
          setCurrentUser(updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          navigate(`${selectedRole}-profile/:${currentUser.email}/articles`); // Navigate to articles after role selection
        } else {
          setError(message);
        }
      }
    } catch (err) {
      console.error("Error during role selection:", err);
      setError("An error occurred. Please try again.");
    }
  }


  return (
    <div className="home-container">
      {!isSignedIn ? (
        <div className="welcome-text">
          <h2>Welcome to Our Platform</h2>
        </div>
      ) : newUser ? (
        <div className="content-container">
          <div className="profile-card">
            <img src={user.imageUrl} alt="Profile" />
            <h3>{user.firstName}</h3>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="role-selection">
            <h4>Select Your Role</h4>
            <label className="form-check">
              <input type="radio" name="role" value="author" onChange={onSelectRole} />
              Author
            </label>
            <label className="form-check">
              <input type="radio" name="role" value="user" onChange={onSelectRole} />
              User
            </label>
          </div>
        </div>
      ) : (
        <div className="loading">
          <p>Redirecting to articles...</p>
        </div>
      )}
    </div>
  );
}

export default Home;
