import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mb-6">About Me</h1>
        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          Hello! I&apos;m a passionate software developer with a strong background in building scalable and efficient web applications. I have experience working with a variety of technologies including JavaScript, React, Node.js, and more.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          I enjoy solving complex problems and continuously learning new things to improve my skills. My goal is to create impactful software that makes a difference in people&apos;s lives.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed">
          When I&apos;m not coding, you can find me exploring new places, reading tech blogs, or contributing to open-source projects.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
            Contact Me
          </button>
          <button className="border border-gray-500 text-gray-300 px-4 py-2 rounded-full hover:bg-gray-800">
            Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
