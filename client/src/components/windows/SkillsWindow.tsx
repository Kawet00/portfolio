export default function SkillsWindow() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Technical Skills</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Frontend</h3>
          <div className="space-y-3">
            <SkillBar
              skill="JavaScript/TypeScript"
              percentage={80}
              color="bg-blue-500"
            />
            <SkillBar skill="React" percentage={50} color="bg-blue-500" />
            <SkillBar skill="Vue.js" percentage={60} color="bg-blue-500" />
            <SkillBar
              skill="HTML/CSS/SASS"
              percentage={60}
              color="bg-blue-500"
            />
            <SkillBar
              skill="Tailwind CSS"
              percentage={50}
              color="bg-blue-500"
            />
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Tools</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Git",
              "Webpack",
              "Docker",
              "AWS",
              "VS Code",
              "JetBrains IDEs",
            ].map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 bg-gray-700 rounded-lg text-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Backend</h3>
          <div className="space-y-3">
            <SkillBar skill="Node.js" percentage={90} color="bg-green-500" />
            <SkillBar skill="Lua" percentage={90} color="bg-green-500" />
            <SkillBar skill="Express" percentage={75} color="bg-green-500" />
            <SkillBar skill="Python" percentage={75} color="bg-green-500" />
            <SkillBar skill="SQL/NoSQL" percentage={80} color="bg-green-500" />
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Soft Skills</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Problem Solving",
              "Team Collaboration",
              "Communication",
              "Time Management",
              "Agile Methodology",
              "Project Planning",
            ].map((skill) => (
              <div key={skill} className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2"></i>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkillBarProps {
  skill: string;
  percentage: number;
  color: string;
}

function SkillBar({ skill, percentage, color }: SkillBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{skill}</span>
        <span className="text-sm text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
