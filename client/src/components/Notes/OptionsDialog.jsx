import React, { useRef } from 'react'
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { useDimensions } from "../../usedimensions";
import { IoMdOptions } from "react-icons/io";


const Path = props => (
    <motion.path
        fill="transparent"
        strokeWidth="2"
        stroke="#000"
        strokeLinecap="round"
        {...props}
    />
);

const sidebar = {
    open: ({ height, width }) => ({
        clipPath: `circle(${height * 3}px at 0px 20px)`,
        transition: {
            type: "spring",
            stiffness: 35,
            restDelta: 2
        }

    }),
    closed: ({ width }) => ({
        clipPath: `circle(20px at ${(width || 614.4) - 20}px 20px)`,
        transition: {
            delay: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    })

}

const SearchToggle = ({ toggle }) => {
    return (
        <button onClick={toggle} className='w-10 h-10 rounded-full grid place-items-center relative z-10'>
            <svg width="20" height="20" viewBox="0 0 20 20">
                <Path
                    variants={{
                        closed: { d: "M 2 2.5 L 20 2.5", opacity: 0 },
                        open: { d: "M 3 16.5 L 17 2.5", opacity: 0.8 }
                    }}
                />
                <Path
                    fill="none"
                    variants={{
                        closed: { d: "M 2 16.346 L 20 16.346", opacity: 0 },
                        open: { d: "M 3 2.5 L 17 16.346", opacity: 0.8 }
                    }}
                />
            </svg>

            <motion.span className="search-path absolute" fill="none" stroke="#000" variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
            }}>
                <IoMdOptions />
            </motion.span>

        </button>
    )
}

const Search = () => {
    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);
    const size = useDimensions(containerRef)

    return (
        <motion.div
            initial={false}
            animate={isOpen ? "open" : "closed"}
            className='z-10'
        >
            <AnimatePresence>
                {isOpen && <motion.div exit={{ opacity: 0 }} transition={{ delay: 0.5 }} className='fixed top-0 left-0 w-full h-full bg-black/50'></motion.div>}
            </AnimatePresence>
            <div className='rounded-full shadow-md'>
                <motion.div custom={size} className="absolute w-11/12 sm:w-8/12 md:w-2/5 -translate-x-[calc(100%-40px)] min-h-80  bg-white shadow-lg rounded-md" ref={containerRef}
                    variants={sidebar} />

                <SearchToggle toggle={toggleOpen} />
            </div>
        </motion.div>
    )

}

export default Search