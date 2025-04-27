import { useQuery } from "@tanstack/react-query";
import { type Profile } from "../../../shared/schema.js";

export default function AboutWindow() {
  const { data: profile, isLoading, error } = useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Échec du chargement du profil");
      return (await res.json()) as Profile;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-red-500 p-4">
        Error loading profile information. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3">
        <div className="rounded-lg overflow-hidden bg-gray-700">
          <img
            src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
            alt="Developer profile"
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="md:w-2/3">
        <h2 className="text-2xl font-bold mb-4">{profile.name}</h2>
        <p className="text-gray-300 mb-4">{profile.intro}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm text-gray-400">Location</h3>
            <p>{profile.location}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Experience</h3>
            <p>{profile.experience}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Education</h3>
            <p>{profile.education}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Available for</h3>
            <p>{profile.availability}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">Bio</h3>
        <p className="text-gray-300 mb-3">{profile.bio}</p>
        <p className="text-gray-300">{profile.bio2}</p>

        <div className="mt-6 flex space-x-3">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              <i className="ri-github-fill text-lg"></i>
            </a>
          )}

          {profile.discord && (
            <a
              href={profile.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              <i className="ri-discord-fill text-lg"></i>
            </a>
          )}

          {profile.codepen && (
            <a
              href={profile.codepen}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              <i className="ri-codepen-line text-lg"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
