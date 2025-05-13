function scoreResume() {
  const file = document.getElementById('resumeFile').files[0];
  const role = document.getElementById('roleSelect').value;
  const results = document.getElementById('results');
  results.innerText = "Scoring...";

  if (!file || !file.name.endsWith('.txt')) {
    results.innerText = "❌ Please upload a .txt resume file.";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    const scoreData = evaluateResume(text, role);
    results.innerText = `⭐ Application Score: ${scoreData.score}/100\n\n📝 Feedback:\n${scoreData.feedback.join('\n')}\n\n💡 ${scoreData.verdict}`;
  };
  reader.readAsText(file);
}

function evaluateResume(text, role) {
  let score = 0;
  const feedback = [];
  const lowerText = text.toLowerCase();

  // ✅ Contact Info
  if (lowerText.includes("@")) {
    score += 10;
  }
  if (lowerText.includes("phone") || lowerText.match(/\d{3}[-.\s]??\d{3}[-.\s]??\d{4}/)) {
    score += 5;
  } else {
    feedback.push("❌ Add a phone number or label it clearly (e.g., 'Phone:').");
  }

  // ✅ Summary
  if (lowerText.includes("summary") || lowerText.includes("objective")) {
    score += 10;
  } else {
    feedback.push("❌ Consider adding a summary or objective statement at the top.");
  }

  // ✅ Action Verbs
  const actionVerbs = ["led", "created", "developed", "managed", "designed", "built", "launched"];
  const usedVerbs = actionVerbs.filter(verb => lowerText.includes(verb));
  score += Math.min(usedVerbs.length * 3, 15);
  if (usedVerbs.length === 0) feedback.push("❌ Use action verbs to show impact (e.g., 'Led a team', 'Built a prototype').");

  // ✅ Measurable results
  if (lowerText.match(/\d+%|\$|increased|reduced|improved/)) {
    score += 10;
  } else {
    feedback.push("❌ Add measurable results (e.g., 'Improved efficiency by 25%').");
  }

  // ✅ Soft skills
  const softSkills = ["communication", "teamwork", "leadership", "problem-solving", "collaboration"];
  const softHits = softSkills.filter(k => lowerText.includes(k));
  score += Math.min(softHits.length * 2, 10);

  // ✅ Role-based keywords
  const roleKeywords = getRoleKeywords(role);
  const matched = roleKeywords.filter(k => lowerText.includes(k.toLowerCase()));
  score += Math.min(matched.length * 3, 15);
  if (matched.length < 3) {
    feedback.push(`❌ Try including more ${role}-related keywords: ${roleKeywords.slice(0, 5).join(", ")}`);
  }

  // ✅ Reasonable length
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 100 && wordCount < 800) {
    score += 15;
  } else {
    feedback.push("❌ Resume is either too short or too long. Aim for 300–600 words.");
  }

  // ✅ Formatting
  if (text.includes("\n\n")) {
    score += 10;
  } else {
    feedback.push("❌ Add space between sections for readability.");
  }

  // ✅ Encouragement
  if (lowerText.includes("helped") || lowerText.includes("assisted")) {
    feedback.push("🔁 Consider reframing passive language into confident, active terms.");
  }

  // Verdict
  let verdict = "";
  if (score >= 80) {
    verdict = "🔥 You're more than ready — go for it!";
  } else if (score >= 60) {
    verdict = "💪 You're close! Just polish a few things and you're good to go.";
  } else {
    verdict = "🌱 Great foundation! A few edits can really make this shine.";
  }

  return { score, feedback, verdict };
}

function getRoleKeywords(role) {
  const keywordMap = {
    "Software Engineer": ["Java", "Python", "Git", "APIs", "React", "OOP", "debugging"],
    "UX Designer": ["Figma", "user research", "wireframes", "prototyping", "accessibility"],
    "Product Manager": ["roadmap", "agile", "stakeholders", "backlog", "KPI"],
    "Data Analyst": ["SQL", "Excel", "Tableau", "data visualization", "Python", "pivot table"]
  };
  return keywordMap[role] || [];
}
