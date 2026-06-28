import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import WhyUs from "../components/home/WhyUs";
import Footer from "../components/home/Footer";
import DownloadApp from "../components/home/DownloadApp";
import PopularRoutes from "../components/home/PopularRoutes";
function Home() {

    return (

        <>

            <Navbar />
            <Hero />
            
            <Stats />
            <PopularRoutes />
            <WhyUs />
            <DownloadApp />
            <Footer />

        </>

    );

}

export default Home;