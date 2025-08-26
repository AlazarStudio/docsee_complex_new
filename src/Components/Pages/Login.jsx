import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    InputAdornment,
    IconButton,
    CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = ({ currentUser, setCurrentUser }) => {
    const [user, setUser] = useState("");
    const [login, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (currentUser) {
        navigate("/");
    }
    
    const admin = { login: "docsee-admin-panel", password: 'O%#*PIUtiogj9' };

    const handleLogin = async () => {
        if (!login || !password) {
            setError("Логин или пароль не введен");
            return;
        }

        if (login == admin.login && password == admin.password) {
            setLoading(true);

            setTimeout(() => {
                setLoading(false);
                localStorage.setItem('adminAuth', 'true');
                setCurrentUser(true)
                navigate("/");
            }, 1000);
        } else {
            setError("Логин или пароль введен неверно");
        }
    };


    return (
        <Container
            maxWidth="xs"
            sx={{
                display: "flex",
                flexDirection: "column",
                height: `100dvh`,
                padding: "20px",
                justifyContent: "center",
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Box
                    component="img"
                    src="/favicon-alazar-studio.png"
                    alt="Логотип"
                    sx={{ width: "100px", height: "100px", borderRadius: '10px' }}
                />
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Вход
                </Typography>

                <Box component="form" sx={{ width: "100%" }}>
                    <TextField
                        label="Логин"
                        variant="outlined"
                        fullWidth
                        value={login}
                        onChange={(e) => setUsername(e.target.value)}
                        error={!!error}
                        margin="normal"
                    />
                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error}
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {error && (
                        <Typography color="error" variant="body2" align="center" mt={1}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        height: "50px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "8px",
                        backgroundColor: "#835de1",
                    }}
                    onClick={handleLogin}
                >
                    Войти
                </Button>
            )}
        </Container>
    );
};

export default Login;
