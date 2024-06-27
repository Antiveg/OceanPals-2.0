import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../FirebaseConfig'; // Ensure this points to your Firebase configuration
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRemember(e.target.checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user role from Firestore
            const userDoc = await getDoc(doc(db, 'Users', user.uid));
            const userData = userDoc.data();

            if (userData?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }

            // Set cookie if "Remember Me" is checked
            if (remember) {
                Cookies.set('rememberMe', 'true', { expires: 7 }); // Expires in 7 days
                Cookies.set('userEmail', email, { expires: 7 });
            } else {
                Cookies.remove('rememberMe');
                Cookies.remove('userEmail');
            }

            toast.success('Logged in successfully');
        } catch (error) {
            console.error('Login error:', error);
            toast.error((error as Error).message);
        }
    };

    // Pre-fill email if "Remember Me" was previously checked
    React.useEffect(() => {
        const rememberedEmail = Cookies.get('userEmail');
        if (Cookies.get('rememberMe') && rememberedEmail) {
            setEmail(rememberedEmail);
            setRemember(true);
        }
    }, []);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 bg-gradient-to-tr from-teal-50 to-blue-200 h-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="/assets/oceanpals-logo.png" alt="logo" />
                    OceanPals
                </a>
                <div className='mb-5'>
                    <h1 className='text-blue-500 text-lg font-bold'>For Admin Demo Purposes</h1>
                    <p className='text-blue-500 text-lg font-semibold'>Input admin@gmail.com (email) and admin1234 (password)</p>
                </div>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Welcome Back!
                        </h1>
                        <form className="space-y-4 md:space-y-6 text-left" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" value={email} onChange={handleEmailChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" type="checkbox" checked={remember} onChange={handleRememberChange} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                {/* <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a> */}
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet? <button type="button" onClick={() => navigate('/register')} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</button>
                            </p>
                        </form>
                    </div>
                </div>
                
            </div>
            <ToastContainer />
        </section>
    );
}

export default Login;
