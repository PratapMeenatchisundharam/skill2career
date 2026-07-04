const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600
    })
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

// Career guidance: uses real OpenAI API if OPENAI_API_KEY is set in backend/.env,
// otherwise returns a helpful rule-based response so the feature always works.
async function getCareerGuidance(question, profile = {}) {
  if (OPENAI_API_KEY) {
    try {
      const prompt = `You are a career guidance expert. A user with skills [${(profile.skills || []).join(', ')}] and preferred role "${profile.preferredRole || 'not specified'}" asks: "${question}". Give clear, actionable career guidance in under 200 words.`;
      const result = await callOpenAI(prompt);
      if (result) return result;
    } catch (err) {
      console.error('OpenAI call failed, falling back to built-in guidance:', err.message);
    }
  }

  const skills = profile.skills || [];
  const role = profile.preferredRole || 'your target role';
  return `Based on your current skill set (${skills.length ? skills.join(', ') : 'not yet added — add skills in your profile for better guidance'}), here's some guidance for pursuing ${role}:\n\n` +
    `1. Strengthen your core fundamentals in the top 2-3 skills most requested for ${role} roles.\n` +
    `2. Build at least one solid project that demonstrates these skills end-to-end and can be discussed in interviews.\n` +
    `3. Use the Skill-Based Job Search to identify real openings and note which skills repeatedly appear as "required" — prioritize learning those.\n` +
    `4. Tailor a resume per company using the Resume Generator, and practice that company's likely interview questions.\n` +
    `5. Consistency matters more than intensity — steady weekly learning and applying beats occasional bursts.\n\n` +
    `Add your OPENAI_API_KEY in backend/.env to get fully personalized, LLM-generated guidance instead of this built-in advice.`;
}

// Generates a fallback interview question set for a company not in our curated dataset.
function generateGenericInterviewSet(companyName, role) {
  return {
    name: companyName,
    rating: null,
    locations: ['Location data unavailable for this company'],
    requiredSkills: role ? [role] : [],
    about: `We don't have curated interview data for ${companyName} yet, so here are strong general-purpose questions for a ${role || 'this'} role.`,
    technicalQuestions: [
      `Walk me through a challenging technical problem you solved related to ${role || 'your field'}.`,
      'How do you approach debugging an issue you have never seen before?',
      'Explain a core concept from your field to someone non-technical.',
      'How do you ensure the quality and scalability of your work?',
      'What tools or technologies have you used most recently, and why?'
    ],
    hrQuestions: [
      'Tell me about yourself.',
      `Why do you want to work at ${companyName}?`,
      'Describe a time you overcame a difficult challenge at work or in a project.',
      'How do you handle feedback and criticism?',
      'Where do you see your career in the next few years?'
    ],
    tips: [
      'Research the company\'s products, mission, and recent news before the interview.',
      'Prepare 2-3 STAR-format stories that can flex across multiple behavioral questions.',
      'Have clarifying questions ready for technical prompts — it shows structured thinking.'
    ],
    sampleAnswer: 'For "Tell me about yourself": Present → Past → Future structure works well — current role/skills, relevant past experience, and why this role/company fits your future goals.'
  };
}

// Tailors resume content towards a company + role using their required skills.
function generateTailoredSummary(profile, company, role) {
  const matched = (profile.skills || []).filter(s =>
    (company.requiredSkills || []).some(rs => rs.toLowerCase() === s.toLowerCase())
  );
  const missing = (company.requiredSkills || []).filter(
    rs => !(profile.skills || []).some(s => s.toLowerCase() === rs.toLowerCase())
  );

  const summary = `Results-driven ${role || profile.preferredRole || 'professional'} with hands-on experience in ${
    matched.length ? matched.join(', ') : (profile.skills || []).slice(0, 4).join(', ') || 'core technical skills'
  }. Adept at applying strong problem-solving skills to deliver measurable impact, with a keen interest in contributing to ${company.name}'s engineering and product goals.`;

  return { summary, matchedSkills: matched, missingSkills: missing };
}

module.exports = {
  getCareerGuidance,
  generateGenericInterviewSet,
  generateTailoredSummary
};
