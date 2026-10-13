import { createContext, useContext, useDebugValue, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const PRESET_THEMES = [
    { id: 'theme_1', name: 'Grand Line Voyage', preview: '/chat_theme/26035.jpg', url: '/chat_theme/26035.jpg' },
    { id: 'theme_2', name: 'Straw Hat Odyssey', preview: '/chat_theme/27SeS-3N0OrZ2S-2XzAXnpyyDIc7GBSozjXHN_yWytmA27tgNDEr949wlz0wFJch9iqq57R3SxhRWFwVjKsyweYmxxHk8CQuSkNbQPcbX84F2JOInDIvYNPzI4iJ7N_FW7sqv3kb1DUOB-o3nl4FpI1fsyMLU2m2V7FxXGpQ3De-ZM29vYTvPo8Vp5ZiMOZg.jpg', url: '/chat_theme/27SeS-3N0OrZ2S-2XzAXnpyyDIc7GBSozjXHN_yWytmA27tgNDEr949wlz0wFJch9iqq57R3SxhRWFwVjKsyweYmxxHk8CQuSkNbQPcbX84F2JOInDIvYNPzI4iJ7N_FW7sqv3kb1DUOB-o3nl4FpI1fsyMLU2m2V7FxXGpQ3De-ZM29vYTvPo8Vp5ZiMOZg.jpg' },
    { id: 'theme_3', name: 'Thousand Sunny Fleet', preview: '/chat_theme/55hSoTKoTPzK0dP3CmQOcPKxtIZ6um5TvnyMDrLiXmUZ1bqPXNn-ndasxizyCYA-BYmqNPmZZ9RRD4cb2x3jAS0mBDgrtAJJQjFCpZ9MB5bsoHooU0hUjLQojKGfVWXZtpl3ErIVhyEYEpHQpT4k6naDkoMH9DtRkJUMRB3ax_ccqGTU6sIuqYoRKC7lW00P.jpg', url: '/chat_theme/55hSoTKoTPzK0dP3CmQOcPKxtIZ6um5TvnyMDrLiXmUZ1bqPXNn-ndasxizyCYA-BYmqNPmZZ9RRD4cb2x3jAS0mBDgrtAJJQjFCpZ9MB5bsoHooU0hUjLQojKGfVWXZtpl3ErIVhyEYEpHQpT4k6naDkoMH9DtRkJUMRB3ax_ccqGTU6sIuqYoRKC7lW00P.jpg' },
    { id: 'theme_4', name: 'Pirate Kingdom', preview: '/chat_theme/9MLqc4nyKBs8LWkkyaAyQXM9_9w7gBRA73RgchfMinGJaCQ2d3mINTHs4q_yRlbmo76hUggNvUEbv1QWR1O4D5UU6si_e2ttGPd7ZDlra0sg4QdPylK6Wdc6Tex74iPqrwC-xN79t3frhjg9rLPoHP3oxQTLfu0EpT7R7HgpVW7BWWAGCaY8WMiXxlSHzKuE.jpg', url: '/chat_theme/9MLqc4nyKBs8LWkkyaAyQXM9_9w7gBRA73RgchfMinGJaCQ2d3mINTHs4q_yRlbmo76hUggNvUEbv1QWR1O4D5UU6si_e2ttGPd7ZDlra0sg4QdPylK6Wdc6Tex74iPqrwC-xN79t3frhjg9rLPoHP3oxQTLfu0EpT7R7HgpVW7BWWAGCaY8WMiXxlSHzKuE.jpg' },
    { id: 'theme_5', name: 'Wano Country Samurai', preview: '/chat_theme/AG8FhUrbVZvjnosQ-ucZAJDkhOYARkbhWEPsxwI5NJd0zS5O_leZPIehC2L1uzWRF6EAGKqGYahNcj9D9LD78ZEFq5vPKI1tIly2-YziuOKDFBucCkgGcK3oaehyqeYKdD6XRuJD4Snscxz7cLRyl_6eM8ye-k5pSCbv4GioCN89p1D7TaCRVRK-XKd42LAQ.jpg', url: '/chat_theme/AG8FhUrbVZvjnosQ-ucZAJDkhOYARkbhWEPsxwI5NJd0zS5O_leZPIehC2L1uzWRF6EAGKqGYahNcj9D9LD78ZEFq5vPKI1tIly2-YziuOKDFBucCkgGcK3oaehyqeYKdD6XRuJD4Snscxz7cLRyl_6eM8ye-k5pSCbv4GioCN89p1D7TaCRVRK-XKd42LAQ.jpg' },
    { id: 'theme_6', name: 'Ocean Horizon', preview: '/chat_theme/BOEunx7ODnRCiNWFYlE2zO6d6K4pNWwO5B0Gy-b-ZbO8XD3SrnEUrUjnk7a6u9nN1tn-Sftpv3oIsI2qADDhRCisxsDytx3OxQmh0_0s_XldBqxR_gcH9o9dQsb7wlt-G0r6p2EWjXxqcOLpRJOXz87TtP9z9SowTXBhWGGPNHILo2wn2G9Qg803YjeRuHOb.jpg', url: '/chat_theme/BOEunx7ODnRCiNWFYlE2zO6d6K4pNWwO5B0Gy-b-ZbO8XD3SrnEUrUjnk7a6u9nN1tn-Sftpv3oIsI2qADDhRCisxsDytx3OxQmh0_0s_XldBqxR_gcH9o9dQsb7wlt-G0r6p2EWjXxqcOLpRJOXz87TtP9z9SowTXBhWGGPNHILo2wn2G9Qg803YjeRuHOb.jpg' },
    { id: 'theme_7', name: 'Red Hair Fleet', preview: '/chat_theme/bqRHGf7K_4YiSejAvsj2d8Erh0Wh_WIVsi9xeEknsFguNDgnz8HOM6esDvbousEbotzCNvgIQoVjGjoyp440fGVRBDnoR7u1R8LJynHe3iGz2vrC9PBBkhg_WvWIi1bHB0QffD9JHduONQvql2gpVU4_34uHOmiPQqfFLi_OhXMhNOnqe8AydGs3sSEZUfvV.jpg', url: '/chat_theme/bqRHGf7K_4YiSejAvsj2d8Erh0Wh_WIVsi9xeEknsFguNDgnz8HOM6esDvbousEbotzCNvgIQoVjGjoyp440fGVRBDnoR7u1R8LJynHe3iGz2vrC9PBBkhg_WvWIi1bHB0QffD9JHduONQvql2gpVU4_34uHOmiPQqfFLi_OhXMhNOnqe8AydGs3sSEZUfvV.jpg' },
    { id: 'theme_8', name: 'Tony Tony Chopper', preview: '/chat_theme/chopper.jpg', url: '/chat_theme/chopper.jpg' },
    { id: 'theme_9', name: 'Marineford Dawn', preview: '/chat_theme/DSQ0rG40AhSqAEhi3Ma1Wx0dw4_GpcqMmQuWua4aB0OSl7kG2zX693QdovsIwgsTPnklg05ZvX0fxpAIoKMONf23rUq4Q45TjsJtFo5BzGeR_DGDTuewkEvEuNCNhyZPiHwzCWimzHIyK6SIWtCxIQ-C8RPeHjb-wCeEqeGk5hBEzPA7yYWRaRAh5LB_5pc5.jpg', url: '/chat_theme/DSQ0rG40AhSqAEhi3Ma1Wx0dw4_GpcqMmQuWua4aB0OSl7kG2zX693QdovsIwgsTPnklg05ZvX0fxpAIoKMONf23rUq4Q45TjsJtFo5BzGeR_DGDTuewkEvEuNCNhyZPiHwzCWimzHIyK6SIWtCxIQ-C8RPeHjb-wCeEqeGk5hBEzPA7yYWRaRAh5LB_5pc5.jpg' },
    { id: 'theme_10', name: 'Going Merry Memories', preview: '/chat_theme/DTyT80TcM0nW3FHnIkjlNxB1G5awfT6gMWCBD-fg-ioJXYf73lKE-wcy_y5KxqWgP-J3_oftbuDMWdPEbxCliZwEGvGU7F75QolqQYhT3v-I7TeoQ3qkY2F5U4pTcuRB5XdcsfzAYaIySYsMnqTrcsqco66aP9Bg_94alGJlPmcebXilGJBfPUWdLId3JKU8.jpg', url: '/chat_theme/DTyT80TcM0nW3FHnIkjlNxB1G5awfT6gMWCBD-fg-ioJXYf73lKE-wcy_y5KxqWgP-J3_oftbuDMWdPEbxCliZwEGvGU7F75QolqQYhT3v-I7TeoQ3qkY2F5U4pTcuRB5XdcsfzAYaIySYsMnqTrcsqco66aP9Bg_94alGJlPmcebXilGJBfPUWdLId3JKU8.jpg' },
    { id: 'theme_11', name: 'Grand Line Voyage II', preview: '/chat_theme/gyUPJSiceZ4hBcvg6LVtfMbbSocbIZpzeS1xBDp3YT8hEJwrCc--KQn6iTldes40U7ee64DHhV7Yv7dThuFamRiMiQIWfrY3YH0IPJo0SRvDcJzjA9xBsuym8Z9TkwE5TcOy-cR3Z5FxaTJWLth5jcWvJwFf_FzyoKyqEFhLeuYKOjIjR-PzXvKqIBmo54Ev.jpg', url: '/chat_theme/gyUPJSiceZ4hBcvg6LVtfMbbSocbIZpzeS1xBDp3YT8hEJwrCc--KQn6iTldes40U7ee64DHhV7Yv7dThuFamRiMiQIWfrY3YH0IPJo0SRvDcJzjA9xBsuym8Z9TkwE5TcOy-cR3Z5FxaTJWLth5jcWvJwFf_FzyoKyqEFhLeuYKOjIjR-PzXvKqIBmo54Ev.jpg' },
    { id: 'theme_12', name: 'Skypiea Clouds', preview: '/chat_theme/hTUtZifeqYQiEXAXI0SOlLQeaV6dbAHnbkjHeN4RhL1OOnSOw_DBXXRqrSTlDoSx5wqpS5YH-6QLND37b8JsdEqfrf7RsWvqd6Gp6VGo93GYz7BgjeFYmY0Q1OJFw4MTuFZU7TQYd67w7tHRRAZBBzMdANGW-d8WQqSfbfJHieKEvLqe2r62i3IXvxTu_E3T.jpg', url: '/chat_theme/hTUtZifeqYQiEXAXI0SOlLQeaV6dbAHnbkjHeN4RhL1OOnSOw_DBXXRqrSTlDoSx5wqpS5YH-6QLND37b8JsdEqfrf7RsWvqd6Gp6VGo93GYz7BgjeFYmY0Q1OJFw4MTuFZU7TQYd67w7tHRRAZBBzMdANGW-d8WQqSfbfJHieKEvLqe2r62i3IXvxTu_E3T.jpg' },
    { id: 'theme_13', name: 'Cat Burglar Nami', preview: '/chat_theme/nami.jpg', url: '/chat_theme/nami.jpg' },
    { id: 'theme_14', name: 'Navigator Nami', preview: '/chat_theme/nammii.jpg', url: '/chat_theme/nammii.jpg' },
    { id: 'theme_15', name: 'Pirate King Crown', preview: '/chat_theme/rBv3kc6Wx5K_iAaQ_TWv186X6dgSdmTq20sV9ClDhTC3ykq6f7Bp-9mTo0SbPnWow_HtdFFwJwC1XmLEKXx2Epn66EUmO1cSMbRdsX4JC5Y26uCxBTPIM56KxdARNJqbFqIqgfHVQUMMKlR2BsWH3TZzLlNdNEnbkSncTVkrPq9WgykVTWerxTNu-S3VXBsi.jpg', url: '/chat_theme/rBv3kc6Wx5K_iAaQ_TWv186X6dgSdmTq20sV9ClDhTC3ykq6f7Bp-9mTo0SbPnWow_HtdFFwJwC1XmLEKXx2Epn66EUmO1cSMbRdsX4JC5Y26uCxBTPIM56KxdARNJqbFqIqgfHVQUMMKlR2BsWH3TZzLlNdNEnbkSncTVkrPq9WgykVTWerxTNu-S3VXBsi.jpg' },
    { id: 'theme_16', name: 'Robin & Nami', preview: '/chat_theme/robi_namia.jpg', url: '/chat_theme/robi_namia.jpg' },
    { id: 'theme_17', name: 'Heart Pirates', preview: '/chat_theme/RRwfGNv1oOVHYz6H6APp6rDojDYHEUJ9cvqJKid3qrgeJZzBoyub4ijTTK4ShzzunmeUXmjoPw8UIYGY-bB6EKWzT25lf2beV6LZr-ePXvY_SfwHo7Bzwa5y57BGm98KwVosc5tZkLY3t5VTBU4JLj00F603Fk_9KYjyuFr848zbScwWC6AxiseWbM9Vn8je.jpg', url: '/chat_theme/RRwfGNv1oOVHYz6H6APp6rDojDYHEUJ9cvqJKid3qrgeJZzBoyub4ijTTK4ShzzunmeUXmjoPw8UIYGY-bB6EKWzT25lf2beV6LZr-ePXvY_SfwHo7Bzwa5y57BGm98KwVosc5tZkLY3t5VTBU4JLj00F603Fk_9KYjyuFr848zbScwWC6AxiseWbM9Vn8je.jpg' },
    { id: 'theme_18', name: 'Sunny Go Voyage', preview: '/chat_theme/T-NM5AppofFS6H2Eutm9fVNk6Z4aoZ2Ez69L_ORk47wrSe-hSKnUfZbuMsT6WskAuA1PCdDV8uF8g61oPU_whCI9_EmToP8oSDsYqSF8wbkR11bYFZx0kf28yMYEflAF8tAAZv-742H75WgpSPDpA0z2qAU-DGqgh4wDDn9YMsFilSkBggr7J2HrgHjfY5U8.jpg', url: '/chat_theme/T-NM5AppofFS6H2Eutm9fVNk6Z4aoZ2Ez69L_ORk47wrSe-hSKnUfZbuMsT6WskAuA1PCdDV8uF8g61oPU_whCI9_EmToP8oSDsYqSF8wbkR11bYFZx0kf28yMYEflAF8tAAZv-742H75WgpSPDpA0z2qAU-DGqgh4wDDn9YMsFilSkBggr7J2HrgHjfY5U8.jpg' },
    { id: 'theme_19', name: 'Doctor Chopper', preview: '/chat_theme/tony.jpg', url: '/chat_theme/tony.jpg' },
    { id: 'theme_20', name: 'Sabaody Archipelago', preview: '/chat_theme/XqdafdCuNz1G2YZtfm9tlqXHZd72VsoTVXwbM1iQ6wgeTn63wf8cuQcDMq3_GrbTgi9Os8pyvH-dK6DzTPFyJEN55eIScR9eJ5_iJXDkHgD8py7pBzq827FSsXsgvgp9O6EuU56JRSBKD8srpBt0zCYPV2uHo8-eclQIhy7UZi7Cv867BfJiCYlKxB9WTsLx.jpg', url: '/chat_theme/XqdafdCuNz1G2YZtfm9tlqXHZd72VsoTVXwbM1iQ6wgeTn63wf8cuQcDMq3_GrbTgi9Os8pyvH-dK6DzTPFyJEN55eIScR9eJ5_iJXDkHgD8py7pBzq827FSsXsgvgp9O6EuU56JRSBKD8srpBt0zCYPV2uHo8-eclQIhy7UZi7Cv867BfJiCYlKxB9WTsLx.jpg' },
    { id: 'theme_21', name: 'East Blue Horizon', preview: '/chat_theme/yeK89uZxSDsgQ8vC6ICTwcTQipPiKTJXJks5WLQkvx2_u5M3L653Hyn10wHRwFHRuzvUWE9khrQRpOq-hzvivnsqSTAwJSjKrZQKR0NSU-iU6DTicbff_YTyThmm4YDJ3_EYRzPFijifIJAGupAZpr2GJXcx9nLLT9Eb98B73ll704vLtUnAEeRGhyEQPFgV.jpg', url: '/chat_theme/yeK89uZxSDsgQ8vC6ICTwcTQipPiKTJXJks5WLQkvx2_u5M3L653Hyn10wHRwFHRuzvUWE9khrQRpOq-hzvivnsqSTAwJSjKrZQKR0NSU-iU6DTicbff_YTyThmm4YDJ3_EYRzPFijifIJAGupAZpr2GJXcx9nLLT9Eb98B73ll704vLtUnAEeRGhyEQPFgV.jpg' },
    { id: 'theme_22', name: 'New World Adventure', preview: '/chat_theme/zXoYdRSdy-mNnGCW6TmS0yG9MWSx4WvjEGrisKVPLM4uz_c7vTWkqRJkw_bNZm6wyiW5FlUF2Zt9YYGO3LpvJ2yf8wUirLHAqCum8T3DVFHjsXyvQNMqG8y_JKKHPjPcESbUZV2LkdCn7uT2NtKzQb3ayA1b3HlMujX4HL21V7od_YCTWDSo1HnxVToEPXtu.jpg', url: '/chat_theme/zXoYdRSdy-mNnGCW6TmS0yG9MWSx4WvjEGrisKVPLM4uz_c7vTWkqRJkw_bNZm6wyiW5FlUF2Zt9YYGO3LpvJ2yf8wUirLHAqCum8T3DVFHjsXyvQNMqG8y_JKKHPjPcESbUZV2LkdCn7uT2NtKzQb3ayA1b3HlMujX4HL21V7od_YCTWDSo1HnxVToEPXtu.jpg' },
];

export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages, setMessages ] = useState([]);
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [crews, setCrews] = useState([]);
    const [selectedUser, setSelectedUser ] = useState(null);
    const [unseenMessages, setUnseenMessages ] = useState({});

    // Per-chat custom themes (stored in localStorage)
    const [chatThemes, setChatThemes] = useState(() => {
        try {
            const saved = localStorage.getItem('gl_chat_themes');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const setChatTheme = (convId, themeUrl) => {
        setChatThemes(prev => {
            const updated = { ...prev };
            if (!themeUrl) {
                delete updated[convId];
            } else {
                updated[convId] = themeUrl;
            }
            try {
                localStorage.setItem('gl_chat_themes', JSON.stringify(updated));
            } catch (e) {
                console.error(e);
            }
            return updated;
        });
    };

    const { axios, socket, authUser } = useContext(AuthContext);

    // function to get all crews for logged in user
    const getCrews = async () => {
        try {
            const { data } = await axios.get("/api/crews");
            if (data.success) {
                setCrews(data.crews);
            }
        } catch (error) {
            console.error("Failed to load crews from backend", error);
        }
    };

    // Load crews for logged in user from backend
    useEffect(() => {
        if (authUser?._id) {
            getCrews();
        } else {
            setCrews([]);
        }
    }, [authUser]);

    // Function to create a new Crew / Group via backend API
    const createCrew = async (crewData) => {
        try {
            const memberIds = (crewData.members || [])
                .map(m => m._id)
                .filter(id => id && id !== authUser?._id);

            const { data } = await axios.post("/api/crews/create", {
                name: crewData.name || crewData.fullName,
                flag: crewData.flag || crewData.emblem || "🏴‍☠️",
                members: memberIds,
            });

            if (data.success) {
                const newCrew = data.crew;
                setCrews(prev => [newCrew, ...prev.filter(c => c._id !== newCrew._id)]);
                setSelectedUser(newCrew);
                if (socket) {
                    socket.emit("joinCrew", newCrew._id);
                }
                if (data.inauguralMsg) {
                    setMessages([data.inauguralMsg]);
                } else {
                    await getMessages(newCrew._id);
                }
                return newCrew;
            } else {
                toast.error(data.message || "Failed to assemble crew");
                throw new Error(data.message);
            }
        } catch (err) {
            console.error("Error creating crew:", err);
            toast.error(err.response?.data?.message || err.message || "Failed to assemble crew");
            throw err;
        }
    };

    // function to get mutual users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to fetch all users in the fleet directory
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get("/api/auth/all");
            if (data.success) {
                setAllUsers(data.users);
            }
        } catch (error) {
            console.error("Failed to load directory users", error);
        }
    };

    // function to follow/unfollow a user
    const toggleFollowUser = async (targetUserId) => {
        try {
            const { data } = await axios.post(`/api/auth/follow/${targetUserId}`);
            if (data.success) {
                toast.success(data.message);
                // Update directory list locally
                setAllUsers(prev => prev.map(u => {
                    if (u._id === targetUserId) {
                        return {
                            ...u,
                            isFollowing: data.isFollowing,
                            isMutual: data.isMutual,
                        };
                    }
                    return u;
                }));
                // Refresh sidebar mutual users immediately!
                getUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // function to get message for selected user or crew
    const getMessages = async (userId)=>{
        try {
            const targetId = userId || selectedUser?._id;
            if (!targetId) return;

            const isGroup = selectedUser?.isGroup || (typeof targetId === 'string' && (targetId.startsWith('crew_') || (selectedUser?._id === targetId && selectedUser?.isGroup)));

            if (isGroup) {
                const { data } = await axios.get(`/api/crews/${targetId}/messages`);
                if (data.success) {
                    setMessages(data.messages);
                }
                return;
            }

            const { data } = await axios.get(`/api/messages/${targetId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user or crew
    const sendMessage = async (messageData) => {
        try {
            if (selectedUser?.isGroup) {
                const { data } = await axios.post(`/api/crews/${selectedUser._id}/messages`, messageData);
                if (data.success) {
                    setMessages(prev => {
                        if (prev.some(m => m._id === data.newMessage._id)) return prev;
                        return [...prev, data.newMessage];
                    });
                } else {
                    toast.error(data.message || "Failed to send crew message");
                }
                return;
            }

            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);

            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to subscribe to message and crew socket events
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && !selectedUser.isGroup && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [ newMessage.senderId ] :
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages
                    [newMessage.sender] + 1 : 1
                }))
            }
        });

        socket.on("newCrewMessage", (newMsg) => {
            if (selectedUser && selectedUser.isGroup && selectedUser._id === newMsg.crewId) {
                setMessages((prevMessages) => {
                    if (prevMessages.some(m => m._id === newMsg._id)) return prevMessages;
                    return [...prevMessages, newMsg];
                });
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMsg.crewId]: (prevUnseenMessages[newMsg.crewId] || 0) + 1
                }));
            }
        });

        socket.on("newCrew", (newCrew) => {
            setCrews((prev) => {
                if (prev.some(c => c._id === newCrew._id)) return prev;
                return [newCrew, ...prev];
            });
            if (socket) {
                socket.emit("joinCrew", newCrew._id);
            }
            toast.success(`Recruited to Crew "${newCrew.fullName}"!`, { icon: newCrew.flag || '🏴‍☠️' });
        });
    }

    // Function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket) {
            socket.off("newMessage");
            socket.off("newCrewMessage");
            socket.off("newCrew");
        }
    }

    // Join all user crew rooms upon socket connection or crews change
    useEffect(() => {
        if (socket && crews.length > 0) {
            crews.forEach(c => {
                socket.emit("joinCrew", c._id);
            });
        }
    }, [socket, crews]);

    // Ensure currently selected crew room is joined
    useEffect(() => {
        if (selectedUser && selectedUser.isGroup && socket) {
            socket.emit("joinCrew", selectedUser._id);
        }
    }, [selectedUser, socket]);

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])

    const value = {
        messages, users, allUsers, getAllUsers, toggleFollowUser,
        crews, setCrews, getCrews, createCrew, selectedUser, getUsers, getMessages,
        sendMessage, setSelectedUser, unseenMessages, setUnseenMessages,
        chatThemes, setChatTheme, PRESET_THEMES
    }
    return(
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}