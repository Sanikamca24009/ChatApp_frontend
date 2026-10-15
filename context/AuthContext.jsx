import { Children, createContext, useEffect, useState  } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl


export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{

    const [ token, setToken ] = useState(localStorage.getItem("token"));
    const [ authUser, setAuthUser ] = useState(null);
    const [ onlineUsers, setOnlineUsers ] = useState([]);
    const [ socket, setSocket ] = useState(null);

// check if user is authenticated and if so, set the user data and connect the socket 

    const checkAuth = async() => {
        try {
            const { data } = await axios.get("/api/auth/check")
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user, token);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // login function to handle user authentication and socket connection
    const login = async (state, credentials ) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials );
            if(data.success){
                setAuthUser(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token",data.token);
                connectSocket(data.userData, data.token);
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // logout function to handle user logout and socket disconnection
    const logout = async()=>{
        try {
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            setOnlineUsers([]);
            if (axios.defaults.headers.common["token"]) {
                delete axios.defaults.headers.common["token"];
            }
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            // Ensure state is cleared even if an error occurs
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
        }
    }

    // Update profile function to handel user profile updates 

    const updateProfile = async (body)=>{
        try {
            const { data } = await axios.put("/api/auth/update-profile", body );
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully ")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Connect socket function to handle socket connection with JWT auth
    const connectSocket = (userData, customToken) => {
        const authToken = customToken || token || localStorage.getItem("token");
        if (!userData || !authToken) return;
        if (socket?.connected) return;

        const newSocket = io(backendUrl, {
            auth: {
                token: authToken,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket authentication/connection error:", err.message);
        });
    }
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    },[])
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}