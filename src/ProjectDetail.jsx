import React from 'react';
import { Code, Cpu, Target, Lightbulb, ArrowLeft } from 'lucide-react';

const ProjectDetail = ({ project, onBack }) => {
  if (!project) return null;

  return (
    <article className="h-full w-full bg-white text-gray-800 overflow-y-auto custom-scrollbar">
      <header className="relative h-64 bg-gray-900 text-white flex items-end p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 w-full">
          <button 
            onClick={onBack}
            className="absolute top-[-20px] right-0 text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Menu
          </button>
          <div className="flex items-center gap-4 mb-2">
            <span className="px-3 py-1 bg-blue-600/30 border border-blue-500/50 rounded-full text-xs font-mono text-blue-300">
              {project.category || 'Engineering'}
            </span>
            <span className="text-gray-400 text-sm font-mono">{project.date}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{project.title}</h1>
          <p className="text-gray-300 max-w-2xl text-lg">{project.tagline}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="text-red-500" /> The Problem
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {project.problem}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Cpu className="text-blue-500" /> Key Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, idx) => (
                <li key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Interface Gallery</h2>
            <div className="space-y-4">
              {project.screenshots.map((img, idx) => (
                <figure key={idx} className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <div className="aspect-video bg-gray-200 relative">
                    {img ? (
                      <img src={img} alt={`Screenshot ${idx}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono">
                        [Screenshot {idx + 1} Placeholder]
                      </div>
                    )}
                  </div>
                </figure>
              ))}
            </div>
          </section>

          <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Lightbulb className="text-blue-600" /> Lessons Learned
            </h2>
            <p className="text-blue-800 leading-relaxed">
              {project.learned}
            </p>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Code className="text-green-400" /> Tech Stack
            </h3>
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <li key={i} className="px-3 py-1 bg-gray-700 rounded-lg text-sm font-mono text-gray-300 border border-gray-600">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
             {project.links.demo && (
               <a href={project.links.demo} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200">
                 Launch Live Demo
               </a>
             )}
             {project.links.github && (
               <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">
                 View Source Code
               </a>
             )}
          </div>
        </aside>
      </div>
    </article>
  );
};

export default ProjectDetail;