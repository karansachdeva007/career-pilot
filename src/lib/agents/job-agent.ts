export async function matchJobs(userSkills: string[]) {
  if (!userSkills || userSkills.length === 0) {
    return [];
  }

  // Fetch live remote jobs from RemoteOK API
  const response = await fetch("https://remoteok.com/api");
  const rawJobs = await response.json();
  
  // The first item in RemoteOK API is a legal notice, so we slice from index 1
  const liveJobs = rawJobs.slice(1).map((job: any) => ({
    id: job.id.toString(),
    title: job.position,
    company: job.company,
    description: job.description.replace(/(<([^>]+)>)/gi, "").substring(0, 300) + "...", // Strip HTML and truncate
    requiredSkills: job.tags ? job.tags.join(", ") : "",
    applyUrl: job.url,
    location: job.location || "Remote",
  }));

  // For the MVP, we'll just match against the first 50 live jobs to keep it fast
  const allJobs = liveJobs.slice(0, 50);

  const matchedJobs = allJobs.map((job: any) => {
    const jobSkills = job.requiredSkills
      .toLowerCase()
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    let matchedCount = 0;
    jobSkills.forEach((skill: string) => {
      if (userSkills.some((userSkill: string) => userSkill.toLowerCase().includes(skill) || skill.includes(userSkill.toLowerCase()))) {
        matchedCount++;
      }
    });

    const matchPercentage = jobSkills.length > 0 
      ? Math.round((matchedCount / jobSkills.length) * 100) 
      : 0;

    return {
      ...job,
      matchScore: matchPercentage,
    };
  });

  // Sort by highest match score
  matchedJobs.sort((a: any, b: any) => b.matchScore - a.matchScore);

  return matchedJobs;
}
