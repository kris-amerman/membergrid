import "./HeroSection.css";
import SignInGoogle from "./SignInGoogle";

const HeroSection = () => {
    return (
        <div className="gradient h-[44vh] flex flex-col">
            <div className="mx-auto mt-10 text-3xl font-bold text-[#5D5A88] md:text-[3.5rem] md:mt-24">Strengthen your</div>
            <div className="mx-auto text-3xl font-bold text-[#5D5A88] md:text-[3.5rem] md:mt-8">internal network</div>
            <div className="flex justify-center mx-16 text-center mt-3 text-sm text-[#9795B5] font-light md:mx-auto md:text-lg md:mt-9">Membergrid makes it easy to connect with colleagues.</div>
            <div className="mx-auto scale-90 mt-12 md:transform-none md:mt-16"><SignInGoogle /></div>
        </div>
    )
}

export default HeroSection