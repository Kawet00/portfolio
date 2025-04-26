import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Project } from '@shared/schema';

type ProjectCategory = 'All' | 'Web' | 'Mobile' | 'Other';

export default function ProjectsWindow() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const filteredProjects = projects?.filter(project => 
    activeCategory === 'All' || project.category === activeCategory
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !projects) {
    return (
      <div className="text-red-500 p-4">
        Error loading projects. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <div className="flex space-x-2">
          {(['All', 'Web', 'Mobile', 'Other'] as ProjectCategory[]).map(category => (
            <button 
              key={category}
              className={`px-3 py-1 rounded text-sm ${
                activeCategory === category 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card bg-gray-700 rounded-lg overflow-hidden cursor-pointer">
      <div className="h-48 overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold">{project.title}</h3>
          <span className={`text-xs px-2 py-1 ${
            project.category === 'Web' ? 'bg-blue-600' :
            project.category === 'Mobile' ? 'bg-green-600' :
            'bg-purple-600'
          } rounded-full`}>
            {project.category}
          </span>
        </div>
        <p className="text-sm text-gray-300 mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {project.technologies.map((tech, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-gray-600 rounded-full">{tech}</span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              <i className="ri-external-link-line mr-1"></i> View Live
            </a>
          )}
          
          {project.codeUrl && (
            <a 
              href={project.codeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              <i className="ri-github-line mr-1"></i> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
