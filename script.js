function scoreResume() {
    const file = document.getElementById('resumeFile').files[0];
    const results = document.getElementById('results');
    results.innerText = "Scoring...";
  
    if (!file || !file.name.endsWith('.txt')) {
      results.innerText = "Please upload a .txt resume file.";
      return;
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const scoreData = evaluateResume(text);
      results.innerText = `Application Score: ${scoreData.score}/100\n\nFeedback:\n${scoreData.feedback.join('\n')}`;
    };
    reader.readAsText(file);
  }
  
  function evaluateResume(text) {
    let score = 0;
    const feedback = [];
  
    const lowerText = text.toLowerCase();
  
    // ✅ Check for contact info
    if (lowerText.match(/\bemail\b|@|\bphone\b/)) {
      score += 15;
    } else {
      feedback.push("❌ Missing clear contact info (email or phone).");
    }
  
    // ✅ Check for summary/objective
    if (lowerText.includes("summary") || lowerText.includes("objective")) {
      score += 10;
    } else {
      feedback.push("❌ Consider adding a Summary or Objective section.");
    }
  
    // ✅ Check for action verbs
    const actionVerbs = ["led", "created", "developed", "managed", "designed"];
    const foundVerbs = actionVerbs.filter(v => lowerText.includes(v));
    score += Math.min(foundVerbs.length * 3, 15);
  
    if (foundVerbs.length === 0) {
      feedback.push("❌ Add more action verbs like 'Led', 'Created', 'Managed'.");
    }
  
    // ✅ Check for measurable results
    if (lowerText.match(/\b\d+%|\$|increased|reduced\b/)) {
      score += 15;
    } else {
      feedback.push("❌ Add measurable results (e.g., 'Increased sales by 20%').");
    }
  
    // ✅ Keyword match (adjustable)
    const keywords = ["teamwork", "leadership", "python", "communication", "problem-solving"];
    const foundKeywords = keywords.filter(k => lowerText.includes(k));
    score += Math.min(foundKeywords.length * 3, 15);
  
    if (foundKeywords.length < 2) {
      feedback.push("❌ Missing strong keywords (e.g., Python, leadership).");
    }
  
    // ✅ Resume length
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 150 && wordCount <= 700) {
      score += 20;
    } else {
      feedback.push("❌ Resume is too short or too long. Aim for ~300–500 words.");
    }
  
    // ✅ Formatting check
    if (text.includes("\n\n")) {
      score += 10;
    } else {
      feedback.push("❌ Use section spacing to improve readability.");
    }
  
    return { score, feedback };
  }
  