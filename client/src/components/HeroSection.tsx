import "./Gradient.css";
import SignInGoogle from "./SignInGoogle";

const HeroSection = () => {
    return (
        <div>
            <div className="relative h-80 md:h-[33.5rem] overflow-hidden">
                <div className="absolute gradient w-full h-full" />
                <div className="absolute w-full h-full flex flex-col">
                    <div className="mx-auto mt-10 text-3xl font-bold text-[#5D5A88] md:text-[3.5rem] md:mt-36">Strengthen your</div>
                    <div className="mx-auto text-3xl font-bold text-[#5D5A88] md:text-[3.5rem] md:mt-8">internal network</div>
                    <div className="flex justify-center mx-16 text-center mt-3 text-sm text-[#9795B5] font-light md:mx-auto md:text-lg md:mt-8">Membergrid makes it easy to connect with colleagues.</div>
                    <div className="mx-auto scale-90 mt-12 md:transform-none md:mt-16"><SignInGoogle /></div>
                </div>
            </div>

            
            <div className="flex flex-row h-20 bg-[#F9F9FF]">
                
            </div>
        </div>
    )
}

export default HeroSection