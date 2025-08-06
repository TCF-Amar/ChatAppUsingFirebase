import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { signupService } from "../services/signupService.js";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";

const Signup = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    const handleSignup = async () => {
        setLoading(true);
        if (loading) return; // Prevent multiple submissions
        if (!email || !password || !confirmPassword) {
            setLoading(false);
            toast.error("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setLoading(false);
            toast.error("Passwords do not match.");
            return;
        }

        try {
            await signupService.signup(name, email, password);
            setLoading(false);
            toast.success("Signup successful! Welcome aboard.");
            navigate("/");
        } catch (err) {
            setLoading(false);
            console.error("Signup failed:", err);
            if (err.code === "auth/email-already-in-use") {
                toast.error("Email already exists.");
            } else if (err.code === "auth/weak-password") {
                toast.error("Password must be at least 6 characters.");
            } else {
                toast.error("Signup failed. Try again.");
            }
        }
    };

    return (
        <div className="min-h-screen fixed top-0 left-0 right-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Animated background patterns */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute opacity-30"
                        style={{
                            background: `radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)`,
                            width: `${Math.random() * 400 + 200}px`,
                            height: `${Math.random() * 400 + 200}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.2, 0.3],
                            x: [0, Math.random() * 100 - 50, 0],
                            y: [0, Math.random() * 100 - 50, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="backdrop-blur-xl bg-neutral/20 border border-neutral/30 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative z-10"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                }}
            >
                <motion.h1
                    className="text-4xl font-bold text-white mb-2 tracking-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Create Account
                </motion.h1>
                <motion.p
                    className="text-sm text-gray-300 mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Start chatting instantly with friends
                </motion.p>

                <div className="mb-6 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <input
                            type="text"
                            placeholder="Enter name"
                            className="w-full p-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:bg-white/[0.15]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </motion.div>



                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >


                        <input
                            type="email"
                            placeholder="Enter email"
                            className="w-full p-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:bg-white/[0.15]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <input
                            type="password"
                            placeholder="Create password"
                            className="w-full p-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:bg-white/[0.15]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="w-full p-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:bg-white/[0.15]"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </motion.div>
                </div>

                <motion.button
                    onClick={handleSignup}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold mb-4 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >

                    <span className="relative z-10"> {loading ? "Signing Up ..." : "Sign Up"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <motion.div
                    className="flex items-center my-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <hr className="flex-grow border-t border-gray-600" />
                    <span className="mx-3 text-gray-400 text-xs">OR</span>
                    <hr className="flex-grow border-t border-gray-600" />
                </motion.div>

                <motion.button
                    className="flex items-center justify-center gap-2 w-full bg-neutral/30 border border-neutral/40 text-white py-2.5 rounded-xl hover:bg-neutral/40 transition-all relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <FaGoogle className="text-lg relative z-10" />
                    <span className="relative z-10">Continue with Google</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <motion.div
                    className="mt-4 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 underline transition-colors">Login</Link>
                </motion.div>

                <motion.div
                    className="mt-6 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="text-indigo-400 hover:text-indigo-300 underline transition-colors">Terms</Link> and{" "}
                    <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 underline transition-colors">Privacy Policy</Link>.
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;
