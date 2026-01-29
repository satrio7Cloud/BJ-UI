import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import Button from "./Button";

export default function ScrollTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300)
        }

        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)

    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    if (!visible) return null

    return (
        <Button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
            <FiArrowUp size={24} />
        </Button>
    )

} 
