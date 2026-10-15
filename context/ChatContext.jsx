import { createContext, useContext, useDebugValue, useEffect, useRef, useState } from "react";
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
    const [lastMessages, setLastMessages] = useState({});

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

    // Typing state: maps chatId (user ID or crew ID) to array of { id: senderId, name: senderName }
    const [typingUsers, setTypingUsers] = useState({});
    const lastTypingEmitRef = useRef(0);
    const typingTimeoutRef = useRef(null);
    const currentTypingTargetRef = useRef(null);
    const safetyTimersRef = useRef({});

    const stopTyping = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        if (currentTypingTargetRef.current && socket?.connected) {
            socket.emit("typing:stop", currentTypingTargetRef.current);
            currentTypingTargetRef.current = null;
            lastTypingEmitRef.current = 0;
        }
    };

    const sendTyping = () => {
        if (!socket?.connected || !selectedUser) return;

        const target = selectedUser.isGroup
            ? { crewId: selectedUser._id }
            : { recipientId: selectedUser._id };

        const now = Date.now();
        // Throttle typing:start to at most once every 2 seconds
        if (now - lastTypingEmitRef.current >= 2000) {
            socket.emit("typing:start", target);
            lastTypingEmitRef.current = now;
            currentTypingTargetRef.current = target;
        }

        // Reset 2-second inactivity timer
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 2000);
    };

    // Emit typing:stop on chat switch
    useEffect(() => {
        stopTyping();
    }, [selectedUser?._id]);

    // Emit typing:stop on disconnect or tab close
    useEffect(() => {
        const handleBeforeUnload = () => {
            stopTyping();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        if (socket) {
            socket.on("disconnect", stopTyping);
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (socket) {
                socket.off("disconnect", stopTyping);
            }
        };
    }, [socket]);

    // function to get all crews for logged in user
    const getCrews = async () => {
        try {
            const { data } = await axios.get("/api/crews");
            if (data.success) {
                setCrews(data.crews);
                if (data.unseenMessages) {
                    setUnseenMessages(prev => ({ ...prev, ...data.unseenMessages }));
                }
                if (data.lastMessages) {
                    setLastMessages(prev => ({ ...prev, ...data.lastMessages }));
                }
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
                    setLastMessages(prev => ({
                        ...prev,
                        [newCrew._id]: data.inauguralMsg
                    }));
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
                setUsers(data.users);
                setUnseenMessages(prev => ({ ...prev, ...(data.unseenMessages || {}) }));
                if (data.lastMessages) {
                    setLastMessages(prev => ({ ...prev, ...data.lastMessages }));
                }
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
        stopTyping();
        try {
            if (selectedUser?.isGroup) {
                const { data } = await axios.post(`/api/crews/${selectedUser._id}/messages`, messageData);
                if (data.success) {
                    setMessages(prev => {
                        if (prev.some(m => m._id === data.newMessage._id)) return prev;
                        return [...prev, data.newMessage];
                    });
                    setLastMessages(prev => ({
                        ...prev,
                        [selectedUser._id]: {
                            ...data.newMessage,
                            senderId: authUser?._id,
                            senderName: authUser?.fullName || "You"
                        }
                    }));
                } else {
                    toast.error(data.message || "Failed to send crew message");
                }
                return;
            }

            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);

            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage]);
                setLastMessages(prev => ({
                    ...prev,
                    [selectedUser._id]: {
                        ...data.newMessage,
                        senderId: authUser?._id,
                    }
                }));
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
            setLastMessages(prev => ({
                ...prev,
                [newMessage.senderId]: newMessage
            }));

            // Clear typing state and safety timer for sender
            const directTimerKey = `${newMessage.senderId}_${newMessage.senderId}`;
            if (safetyTimersRef.current[directTimerKey]) {
                clearTimeout(safetyTimersRef.current[directTimerKey]);
                delete safetyTimersRef.current[directTimerKey];
            }
            setTypingUsers(prev => {
                const current = prev[newMessage.senderId] || [];
                const nextList = current.filter(u => u.id !== newMessage.senderId);
                if (nextList.length === 0) {
                    const copy = { ...prev };
                    delete copy[newMessage.senderId];
                    return copy;
                }
                return { ...prev, [newMessage.senderId]: nextList };
            });

            if(selectedUser && !selectedUser.isGroup && newMessage.senderId === selectedUser._id){
                newMessage.status = "seen";
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
                socket.emit("ackSeen", { messageId: newMessage._id, senderId: newMessage.senderId });
            }else{
                // Acknowledge delivery so sender receives real-time delivered double-check
                socket.emit("ackDelivered", { messageId: newMessage._id, senderId: newMessage.senderId });
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,
                    [ newMessage.senderId ]: (prevUnseenMessages[newMessage.senderId] || 0) + 1
                }))
            }
        });

        socket.on("messageDelivered", ({ messageId, status }) => {
            setMessages((prev) => prev.map(m => m._id === messageId ? { ...m, status: 'delivered' } : m));
        });

        socket.on("messagesDelivered", ({ messageIds }) => {
            if (Array.isArray(messageIds)) {
                setMessages((prev) => prev.map(m => messageIds.includes(m._id) ? { ...m, status: 'delivered' } : m));
            }
        });

        socket.on("messageSeen", ({ messageId }) => {
            setMessages((prev) => prev.map(m => m._id === messageId ? { ...m, status: 'seen', seen: true } : m));
        });

        socket.on("messagesSeen", ({ byUserId }) => {
            if (selectedUser && !selectedUser.isGroup && selectedUser._id === byUserId) {
                setMessages((prev) => prev.map(m => m.receiverId === byUserId ? { ...m, status: 'seen', seen: true } : m));
            }
        });

        socket.on("crewMessagesSeen", ({ crewId, userId }) => {
            if (selectedUser && selectedUser.isGroup && selectedUser._id === crewId) {
                setMessages((prev) => prev.map(m => {
                    const seenByList = m.seenBy || [];
                    if (!seenByList.includes(userId)) {
                        return { ...m, seenBy: [...seenByList, userId], seen: true };
                    }
                    return m;
                }));
            }
        });

        socket.on("userLastSeen", ({ userId, lastSeen }) => {
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, lastSeen } : u));
            setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, lastSeen } : u));
            setSelectedUser(prev => prev && prev._id === userId ? { ...prev, lastSeen } : prev);
        });

        socket.on("newCrewMessage", (newMsg) => {
            setLastMessages(prev => ({
                ...prev,
                [newMsg.crewId]: newMsg
            }));

            // Clear typing state and safety timer for sender in crew
            const senderUserId = (newMsg.sender?._id || newMsg.senderId)?.toString();
            if (senderUserId) {
                const crewTimerKey = `${newMsg.crewId}_${senderUserId}`;
                if (safetyTimersRef.current[crewTimerKey]) {
                    clearTimeout(safetyTimersRef.current[crewTimerKey]);
                    delete safetyTimersRef.current[crewTimerKey];
                }
                setTypingUsers(prev => {
                    const current = prev[newMsg.crewId] || [];
                    const nextList = current.filter(u => u.id !== senderUserId);
                    if (nextList.length === 0) {
                        const copy = { ...prev };
                        delete copy[newMsg.crewId];
                        return copy;
                    }
                    return { ...prev, [newMsg.crewId]: nextList };
                });
            }

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

        // ── Real-time Typing Handlers ──
        socket.on("userTyping:start", ({ senderId, senderName, crewId }) => {
            if (!senderId) return;
            const chatId = crewId || senderId;
            const timerKey = `${chatId}_${senderId}`;

            // Reset 5-second safety timeout on receiver side
            if (safetyTimersRef.current[timerKey]) {
                clearTimeout(safetyTimersRef.current[timerKey]);
            }
            safetyTimersRef.current[timerKey] = setTimeout(() => {
                setTypingUsers(prev => {
                    const current = prev[chatId] || [];
                    const nextList = current.filter(u => u.id !== senderId);
                    if (nextList.length === 0) {
                        const copy = { ...prev };
                        delete copy[chatId];
                        return copy;
                    }
                    return { ...prev, [chatId]: nextList };
                });
                delete safetyTimersRef.current[timerKey];
            }, 5000);

            setTypingUsers(prev => {
                const current = prev[chatId] || [];
                if (current.some(u => u.id === senderId)) {
                    return prev;
                }
                return {
                    ...prev,
                    [chatId]: [...current, { id: senderId, name: senderName }]
                };
            });
        });

        socket.on("userTyping:stop", ({ senderId, crewId }) => {
            if (!senderId) return;
            const chatId = crewId || senderId;
            const timerKey = `${chatId}_${senderId}`;

            if (safetyTimersRef.current[timerKey]) {
                clearTimeout(safetyTimersRef.current[timerKey]);
                delete safetyTimersRef.current[timerKey];
            }

            setTypingUsers(prev => {
                const current = prev[chatId] || [];
                const nextList = current.filter(u => u.id !== senderId);
                if (nextList.length === 0) {
                    const copy = { ...prev };
                    delete copy[chatId];
                    return copy;
                }
                return { ...prev, [chatId]: nextList };
            });
        });

        socket.on("messageEdited", ({ messageId, text, editedAt }) => {
            setMessages((prev) => prev.map(m => {
                let updated = m;
                if (m._id === messageId) {
                    updated = { ...m, text, editedAt };
                }
                if (m.replyTo && (m.replyTo._id === messageId || m.replyTo === messageId)) {
                    updated = {
                        ...updated,
                        replyTo: typeof m.replyTo === 'object'
                            ? { ...m.replyTo, text }
                            : m.replyTo
                    };
                }
                return updated;
            }));

            setLastMessages((prev) => {
                const next = { ...prev };
                for (const key of Object.keys(next)) {
                    if (next[key]?._id === messageId) {
                        next[key] = { ...next[key], text, editedAt };
                    }
                }
                return next;
            });
        });

        socket.on("messageDeleted", ({ messageId, deleteType, crewId, senderId, receiverId, wasUnseen }) => {
            const chatId = crewId || (senderId === authUser?._id ? receiverId : senderId);

            if (deleteType === "for_me") {
                setMessages((prev) => prev.filter(m => m._id !== messageId));
            } else {
                setMessages((prev) => prev.map(m => {
                    let updated = m;
                    if (m._id === messageId) {
                        updated = { ...m, text: "This message was lost at sea", image: null, isDeletedForAll: true };
                    }
                    if (m.replyTo && (m.replyTo._id === messageId || m.replyTo === messageId)) {
                        updated = {
                            ...updated,
                            replyTo: typeof m.replyTo === 'object'
                                ? { ...m.replyTo, text: "This message was lost at sea", image: null, isDeletedForAll: true }
                                : m.replyTo
                        };
                    }
                    return updated;
                }));

                // Drop unread badge immediately in real time if unread
                if (chatId && wasUnseen && senderId !== authUser?._id) {
                    setUnseenMessages(prev => {
                        const current = prev[chatId] || 0;
                        return {
                            ...prev,
                            [chatId]: Math.max(0, current - 1)
                        };
                    });
                }
            }
            // Refresh sidebar to update previous visible message and unread count
            getUsers();
            getCrews();
        });

        socket.on("messageReaction", ({ messageId, reactions }) => {
            setMessages((prev) => prev.map(m => {
                if (m._id === messageId) {
                    return { ...m, reactions };
                }
                return m;
            }));
        });
    }

    // Function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket) {
            socket.off("newMessage");
            socket.off("newCrewMessage");
            socket.off("newCrew");
            socket.off("messageDelivered");
            socket.off("messagesDelivered");
            socket.off("messageSeen");
            socket.off("messagesSeen");
            socket.off("crewMessagesSeen");
            socket.off("userLastSeen");
            socket.off("userTyping:start");
            socket.off("userTyping:stop");
            socket.off("messageEdited");
            socket.off("messageDeleted");
            socket.off("messageReaction");
        }
        // Clear all active safety timers
        Object.values(safetyTimersRef.current).forEach(t => clearTimeout(t));
        safetyTimersRef.current = {};
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
        messages, setMessages, users, allUsers, getAllUsers, toggleFollowUser,
        crews, setCrews, getCrews, createCrew, selectedUser, getUsers, getMessages,
        sendMessage, setSelectedUser, unseenMessages, setUnseenMessages,
        lastMessages, setLastMessages,
        chatThemes, setChatTheme, PRESET_THEMES,
        typingUsers, sendTyping, stopTyping
    }
    return(
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}