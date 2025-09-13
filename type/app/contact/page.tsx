'use client';

import { Mail, Github, Linkedin, MapPin, Clock, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-100 via-bg-200 to-surface p-4 md:p-10 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-amber-100/90 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-10 border border-peach-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-coffee-800">
            Get In Touch
          </h1>
          <p className="text-lg text-brown-700 max-w-2xl mx-auto">
            I’m open to new opportunities, collaborations, and freelance projects.
          </p>
        </div>

        {/* Contact Cards in Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Email */}
          <a
            href="mailto:ahad06074@gmail.com"
            className={`flex flex-col items-center gap-3 p-5 bg-white/80 hover:bg-white rounded-xl shadow-md hover:shadow-lg border border-amber-300 hover:border-coffee-400 transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0 translate-y-2'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="p-3 bg-amber-300/30 rounded-lg">
              <Mail className="w-6 h-6 text-coffee-700" />
            </div>
            <h3 className="font-semibold text-coffee-800">Email</h3>
            <p className="text-brown-700 text-sm">ahad06074@gmail.com</p>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/AbdulAHAD968"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-3 p-5 bg-white/80 hover:bg-white rounded-xl shadow-md hover:shadow-lg border border-amber-300 hover:border-coffee-400 transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0 translate-y-2'}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="p-3 bg-amber-300/30 rounded-lg">
              <Github className="w-6 h-6 text-coffee-700" />
            </div>
            <h3 className="font-semibold text-coffee-800">GitHub</h3>
            <p className="text-brown-700 text-sm">AbdulAHAD968</p>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/abdulahad-zarinc/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-3 p-5 bg-white/80 hover:bg-white rounded-xl shadow-md hover:shadow-lg border border-amber-300 hover:border-coffee-400 transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0 translate-y-2'}`}
            style={{ transitionDelay: '0.4s' }}
          >
            <div className="p-3 bg-amber-300/30 rounded-lg">
              <Linkedin className="w-6 h-6 text-coffee-700" />
            </div>
            <h3 className="font-semibold text-coffee-800">LinkedIn</h3>
            <p className="text-brown-700 text-sm">abdulahad-zarinc</p>
          </a>
        </div>

        {/* Extra Info Row */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.5s' }}>
          <div className="bg-white/80 rounded-xl p-5 border border-amber-300">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-coffee-700" />
              <h3 className="font-semibold text-coffee-800">Location</h3>
            </div>
            <p className="text-brown-700 text-sm">•Open to freelance work. •Available worldwide  •Remote-first</p>
          </div>
          
          <div className="bg-white/80 rounded-xl p-5 border border-amber-300">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-coffee-700" />
              <h3 className="font-semibold text-coffee-800">Response Time</h3>
            </div>
            <p className="text-brown-700 text-sm">Usually within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
