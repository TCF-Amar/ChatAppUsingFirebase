import React from "react";
import { motion } from "framer-motion";

const dotVariants = {
    initial: { y: 0 },
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            staggerChildren: 0.2,
        },
    },
};

function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br ">
            <motion.div className="flex space-x-2" variants={dotVariants} initial="initial" animate="animate">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="w-4 h-4 rounded-full bg-blue-600"
                        animate={{
                            y: [0, -12, 0],
                        }}
                        transition={{
                            delay: i * 0.2,
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </motion.div>
            <motion.p
                className="mt-4 text-lg  font-medium tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Loading...
            </motion.p>
        </div>
    );
}

export default Loading;
