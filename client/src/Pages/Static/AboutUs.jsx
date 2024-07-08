
import aboutMainImage from "../../Assets/Images/aboutMainImage.png";
import CarouselSlide from "../../Components/CarouselSlide.jsx";
import { celebrities } from "../../Const/CelebrityData.js";
import HomeLayout from "../../Layouts/HomeLayout.jsx";

function AboutUs() {
  return (
    <HomeLayout>
      <div className="px-20 md:px-10 lg:pl-15 pt-20 flex flex-col text-white">
        <div className="flex items-center gap-5 md:flex-col mx-10 md:mx-0">
          <section className="w-1/2 md:w-full space-y-10">
            <h1 className="text-5xl lg:text-3xl md:text-2xl sm:text-xl text-yellow-500 font-semibold">
              Affordable and quality education
            </h1>
            <p className="text-xl text-gray-200 lg:text-lg md:text-base sm:text-sm">
              Our goal is to provide the afoordable and quality education to the
              world. We are providing the platform for the aspiring teachers and
              students to share their skills, creativity and knowledge to each
              other to empower and contribute in the growth and wellness of
              mankind.
            </p>
          </section>

          <div className="w-1/2 md:w-full flex items-center justify-center">
            <img
              id="test1"
              style={{
                filter: "drop-shadow(0px 10px 10px rgb(0,0,0));",
              }}
              alt="about main image"
              className="drop-shadow-2xl md:w-96 md:h-96 "
              src={aboutMainImage}
            />
          </div>
        </div>

        <div className="carousel w-1/2 md:w-full m-auto my-16">
          {celebrities &&
            celebrities.map((celebrity) => (
              <CarouselSlide
                {...celebrity}
                key={celebrity.slideNumber}
                totalSlides={celebrities.length}
              />
            ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
