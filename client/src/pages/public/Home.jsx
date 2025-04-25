import React from "react";
import { Link } from "react-router-dom";
import HeroImg from "../../assets/images/hero.png";
import {
  FaLightbulb,
  FaUserFriends,
  FaRocket,
  FaGraduationCap,
} from "react-icons/fa";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-gray-50 flex items-center justify-center py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Text Content */}
          <div className="text-center md:text-left space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Where <span className="text-amber-500">Skills are Shared</span> &
              <span className="text-amber-500"> Knowledge Flourishes</span>{" "}
              Together bls bls
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-light mb-4 md:mb-7">
              Learn, share your expertise, and grow with the Learnly community!
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                to="/register"
                className="bg-amber-500 text-gray-100 px-8 py-4 rounded-full text-lg font-semibold 
            hover:bg-amber-600 transition-all duration-300 
            transform hover:scale-105 active:scale-95 
            shadow-lg inline-block"
              >
                Sign Up For Free
              </Link>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center md:block">
            <img
              src={HeroImg}
              alt="Fun illustration"
              className="w-3/4 md:w-full h-auto max-w-md mx-auto 
              transform hover:rotate-3 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white" id="about">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About SkillShare Hub
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SkillShare Hub is a dynamic platform designed to help people share
              their expertise and learn from others. Whether you're a coding
              wizard, a culinary master, a photography enthusiast, or a DIY
              craftsman, our platform provides the perfect space to showcase
              your skills and grow your knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="text-amber-500 text-4xl mb-4 flex justify-center">
                <FaLightbulb />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Knowledge</h3>
              <p className="text-gray-600">
                Upload photos and videos showcasing your skills and experiences
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="text-amber-500 text-4xl mb-4 flex justify-center">
                <FaGraduationCap />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn Skills</h3>
              <p className="text-gray-600">
                Follow structured learning plans and track your progress
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="text-amber-500 text-4xl mb-4 flex justify-center">
                <FaUserFriends />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Engage with like-minded individuals through comments and likes
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="text-amber-500 text-4xl mb-4 flex justify-center">
                <FaRocket />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grow</h3>
              <p className="text-gray-600">
                Build your profile and establish yourself as an expert
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50" id="how-it-works">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting started with SkillShare Hub is easy. Follow these simple
              steps to begin your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-md relative z-10">
                <div className="bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Create Your Profile
                </h3>
                <p className="text-gray-600 text-center">
                  Sign up using your social media account and set up your
                  profile to showcase your interests and skills.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-2 bg-amber-500 transform -translate-y-1/2 -translate-x-8 z-0"></div>
            </div>

            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-md relative z-10">
                <div className="bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Explore & Share
                </h3>
                <p className="text-gray-600 text-center">
                  Discover learning plans, follow skilled users, and start
                  sharing your own skill posts.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-2 bg-amber-500 transform -translate-y-1/2 -translate-x-8 z-0"></div>
            </div>

            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-md relative z-10">
                <div className="bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Track Progress
                </h3>
                <p className="text-gray-600 text-center">
                  Update your learning journey, follow structured plans, and
                  engage with the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white" id="features">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover all the powerful tools and features to enhance your
              skill-sharing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Rich Media Sharing
                </h3>
                <p className="text-gray-600">
                  Upload up to 3 photos or short videos per post to effectively
                  demonstrate your skills and techniques.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Progress Tracking
                </h3>
                <p className="text-gray-600">
                  Use predefined templates to document your learning journey and
                  track your improvement over time.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Learning Plans</h3>
                <p className="text-gray-600">
                  Create and share structured learning plans with topics,
                  resources, and completion timelines.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Interactive Community
                </h3>
                <p className="text-gray-600">
                  Engage with other users through likes, comments, and follows
                  to build a supportive learning community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-500 text-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our growing community of skill-sharers and learners today.
            Discover new skills, share your expertise, and grow together.
          </p>
          <Link
            to="/register"
            className="bg-white text-amber-500 px-8 py-4 rounded-full text-lg font-semibold 
            hover:bg-gray-100 transition-all duration-300 
            transform hover:scale-105 active:scale-95 
            shadow-lg inline-block"
          >
            Sign Up For Free
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our community members about their experiences with
              SkillShare Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-500 text-xl font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah K.</h4>
                  <p className="text-gray-500 text-sm">
                    Photography Enthusiast
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've improved my photography skills tremendously since joining
                SkillShare Hub. The structured learning plans and feedback from
                other photographers have been invaluable!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-500 text-xl font-bold">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-gray-500 text-sm">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The community here is amazing! I've been able to share my
                coding knowledge and learn new frameworks from others. The
                progress tracking feature keeps me motivated."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-500 text-xl font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Aisha L.</h4>
                  <p className="text-gray-500 text-sm">DIY Crafter</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I love the ability to upload multiple photos of my craft
                projects and get instant feedback. The platform has connected me
                with so many creative individuals!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
