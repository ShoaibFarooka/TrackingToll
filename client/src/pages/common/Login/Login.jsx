import { useState } from "react";
import './Login.css';
import logo from '../../../assets/images/react.svg';
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { TbEye } from "react-icons/tb";
import { TbEyeOff } from "react-icons/tb";
import userService from "../../../services/userService";

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Handle Input
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setUser({ ...user, [name]: value });
    };

    // Handle Login
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = user;
        if (!email || !password) {
            message.error('Please enter the valid data!');
            return;
        }
        dispatch(ShowLoading());
        try {
            const response = await userService.loginUser(user);
            if (response.token) {
                Cookies.set('tracking-toll-jwt-token', response.token, {
                    secure: true,
                    sameSite: 'Lax'
                });
                const from = location.state?.from.pathname;
                navigate(from || '/');
            }
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    const togglePasswordView = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login min-vh-100 d-flex align-items-center">
            <div className="container shadow">
                <div className="row">
                    <div className="col-md-5 d-flex flex-column align-items-center text-white justify-content-center form py-3">
                        <h1 className="display-4 fw-bolder text-center">Welcome Back</h1>
                        <p className="lead text-center">Enter Your Credentials To Login</p>
                        <img className="mb-3" src={logo} width={"20%"} alt="Banner" />
                        <i className="text-center mb-2">“Tracking Toll Application”.</i>
                    </div>
                    <div className="col-md-6 p-5">
                        <h1 className="display-6 fw-bolder mb-5">LOGIN</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                />
                                <div id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                </div>
                            </div>
                            <div>
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Password
                                </label>
                                <div className="input-group mb-3">
                                    <br />
                                    <input
                                        type={`${showPassword ? 'text' : 'password'}`}
                                        className="input form-control"
                                        id="exampleInputPassword1"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text" onClick={togglePasswordView}>
                                            {!showPassword ? <TbEye size={25} /> : <TbEyeOff size={25} />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mt-4 rounded-pill"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
