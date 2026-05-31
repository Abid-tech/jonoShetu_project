const axios = require('axios');

// YOUR HARDCODED API KEY
const GEMINI_API_KEY = "AIzaSyChMk8Sc6wrOaNHZRheuSdhjUs5vErns1c";

// Legal knowledge base (Bangladesh Constitution & Laws - Expanded)
const LEGAL_KNOWLEDGE_BASE = {
  fundamentalRights: {
    article27: "All citizens are equal before law and are entitled to equal protection of law.",
    article28: "The State shall not discriminate against any citizen on grounds of religion, race, caste, sex or place of birth.",
    article31: "To enjoy the protection of the law, and to be treated in accordance with law, and only in accordance with law, is the inalienable right of every citizen.",
    article32: "No person shall be deprived of life or personal liberty save in accordance with law.",
    article33: "Safeguards as to arrest and detention: (1) No person who is arrested shall be detained in custody without being informed of the grounds of arrest. (2) Every person arrested shall be produced before the nearest magistrate within 24 hours.",
    article34: "All forms of forced labor are prohibited.",
    article35: "Protection in respect of trial and punishment: (1) No person shall be convicted of any offense except for violation of a law in force. (2) No person shall be prosecuted and punished for the same offense twice. (3) No person accused of any offense shall be compelled to be a witness against himself.",
    article36: "Every citizen has the right to freedom of movement throughout Bangladesh.",
    article37: "Every citizen has the right to assemble and to participate in public meetings peacefully and without arms.",
    article38: "Every citizen has the right to form associations or unions.",
    article39: "(1) Freedom of thought and conscience guaranteed. (2) Freedom of speech and expression, subject to reasonable restrictions.",
    article40: "Every citizen has the right to enter into any lawful profession or occupation.",
    article41: "Every citizen has the right to profess, practice or propagate any religion.",
    article42: "Every citizen has the right to acquire, hold, transfer or dispose of property subject to reasonable restrictions.",
  },
  directivePrinciples: {
    article8: "The principles of absolute trust and faith in the Almighty Allah, nationalism, democracy and socialism meaning economic and social justice shall be the fundamental principles of state policy.",
    article10: "Steps shall be taken to ensure participation of women in all spheres of national life.",
    article15: "Basic necessities of life including food, clothing, shelter, education and medical care shall be provided to all citizens.",
    article17: "The State shall adopt effective measures for free and compulsory education for all children up such age as may be determined by law.",
  },
  criminalLaw: {
    theft: "Theft (Penal Code 378-382): Whoever takes movable property without consent with dishonest intent commits theft. Punishment: Up to 3 years imprisonment or fine.",
    robbery: "Robbery (Penal Code 390-395): Theft with fear of instant hurt or death. Punishment: Up to 10 years imprisonment.",
    assault: "Assault (Penal Code 351-358): Making gesture or preparation to cause apprehension of use of criminal force. Punishment: Up to 3 months imprisonment or fine.",
    murder: "Murder (Penal Code 300-304): Causing death with intention to cause death. Punishment: Death or life imprisonment.",
    cheating: "Cheating (Penal Code 415-420): Fraudulently deceiving any person to deliver property. Punishment: Up to 7 years imprisonment and fine.",
    forgery: "Forgery (Penal Code 463-470): Making false document with intent to cause damage. Punishment: Up to 7 years imprisonment and fine.",
    criminalBreach: "Criminal Breach of Trust (Penal Code 405-409): Dishonest misappropriation of property entrusted. Punishment: Up to 7 years imprisonment and fine.",
  },
  landPropertyLaw: {
    landGrabbing: "Under Bangladesh law, land grabbing is illegal under Penal Code Sections 447-450 (criminal trespass) and 425 (mischief). Remedies include: Filing GD at police station, Criminal case under Penal Code, Civil suit for recovery of possession under Specific Relief Act 1877, Application to Assistant Commissioner (Land).",
    propertyDispute: "For property disputes, civil suit can be filed in appropriate court. Limitation Act 1908: 12 years for recovery of immovable property. Registration Act 1908 requires mandatory registration for property transfers.",
    landlordTenant: "Premises Rent Control Act 1991 regulates landlord-tenant relationships. Tenants have protection against arbitrary eviction. Rent increase limited by law.",
  },
  familyLaw: {
    marriage: "Muslim marriage (Nikah) governed by Muslim Family Laws Ordinance 1961. Hindu marriage governed by Hindu Marriage Act. Registration of marriage is mandatory.",
    divorce: "Divorce under Muslim law requires notice to Chairman of Union Council (The Muslim Family Laws Ordinance 1961). Iddat period 90 days. Hindu divorce under Hindu Marriage Act for specific grounds.",
    maintenance: "Maintenance for wife and children under Muslim Family Laws Ordinance and Family Courts Ordinance 1985. Children entitled to maintenance until self-sufficient.",
    inheritance: "Muslim inheritance follows Quranic shares (2:1 male:female ratio for children). Hindu inheritance follows Dayabhaga system where property passes by inheritance.",
  },
  womenChildRights: {
    dowry: "Dowry Prohibition Act 1980: Dowry is illegal. Taking or giving dowry punishable with 1-5 years imprisonment and fine up to 50,000 Taka.",
    childMarriage: "Child Marriage Restraint Act 2017: Marriage below 18 for females and 21 for males is illegal. Punishable with 2 years imprisonment or fine.",
    acidViolence: "Acid Crime Control Act 2002: Acid throwing causing injury punishable with life imprisonment or 7-14 years.",
    womenHarassment: "Women and Children Repression Prevention Act 2000: Sexual harassment, trafficking, and oppression of women are punishable offenses.",
    domesticViolence: "Domestic Violence (Prevention and Protection) Act 2010: Physical, psychological, sexual, and economic violence within family is prohibited. Protection orders available.",
  },
  laborLaw: {
    wages: "Labor Act 2006: Minimum wage fixed by Wage Board. Maximum working hours: 8 hours/day, 48 hours/week. Overtime: twice the regular wage.",
    leave: "Annual leave: 10 days for adults, 14 days for minors. Sick leave: 14 days with full pay. Casual leave: 10 days. Festival leave: 11 days per year.",
    termination: "Termination requires 120 days notice or 120 days wages for permanent workers. Female workers entitled to 4 months paid maternity leave.",
    workplaceSafety: "Employers must provide safe workplace, first aid, fire safety measures. Factory workers have right to form trade unions.",
    gratuity: "Gratuity entitlement after 5 years of continuous service at rate of 14 days wages per completed year.",
  },
  cyberLaw: {
    digitalSecurity: "Digital Security Act 2018: Punishment for cyber crimes including hacking (7-14 years), identity theft (5-10 years), spreading false information (3-7 years), pornography (10 years to life).",
    dataProtection: "Personal data protection: Data must be collected lawfully, used only for specified purposes, kept secure, and not shared without consent.",
    cyberHarassment: "Online harassment and stalking punishable under Digital Security Act. Screenshot evidence admissible in court.",
  },
  consumerRights: {
    rights: "Consumer Rights Protection Act 2009: Right to safety, information, choice, hearing, and redressal. Complaint can be filed with National Consumer Rights Protection Council.",
    liability: "Manufacturer liable for defective products. Seller liable for expired or adulterated products. Punishment: Up to 5 years imprisonment or fine.",
    unfairTrade: "Unfair trade practices including false advertising, hoarding, overcharging prohibited. Compensation available for victims.",
  },
  constitutionalRemedies: {
    writ: "Types of writs under Article 102: Habeas Corpus (illegal detention), Mandamus (public duty), Certiorari (quashing orders), Prohibition (stopping proceedings), Quo Warranto (challenge authority).",
    highCourt: "High Court Division has original jurisdiction for writ petitions under Article 102 of the Constitution.",
    supremeCourt: "Supreme Court of Bangladesh: High Court Division (original and appellate jurisdiction) and Appellate Division (final appellate authority).",
  },
  civilProcedure: {
    limitation: "Limitation Act 1908: Time limits for filing lawsuits. Civil suits generally 3 years. Property recovery 12 years. Appeal 30-90 days.",
    evidence: "Evidence Act 1872: All facts in issue and relevant facts may be proved with oral or documentary evidence. Hearsay evidence generally inadmissible.",
    courtFees: "Court Fees Act: Fees vary by case type and claim amount. Civil suit fee approximately 5-10% of claimed amount. Legal aid available for poor citizens.",
  },
  criminalProcedure: {
    fir: "First Information Report (FIR) can be filed at police station for cognizable offenses. Police must register FIR and investigate.",
    bail: "Non-bailable offenses require court permission. Bailable offenses: police may grant bail. Factors: severity, flight risk, criminal record.",
    trial: "Criminal trial includes: charges framed, prosecution evidence, defense evidence, arguments, judgment. Accused has right to lawyer.",
    appeal: "Criminal appeal to High Court within 60 days of Sessions Court judgment. Death sentence requires High Court confirmation.",
  },
  common: {
    policeReport: "To file a police report (GD), visit your local police station with identification and written complaint. You can also call National Emergency Service 999.",
    bailConditions: "Non-bailable offenses require court permission. Bailable offenses: police may grant bail. Factors considered: severity of crime, likelihood of fleeing, previous criminal record.",
    arrestProcedure: "Police must inform grounds of arrest immediately. Arrested person has right to consult lawyer. Must be produced before magistrate within 24 hours.",
    legalAid: "Bangladesh Legal Aid and Services Trust (BLAST) provides free legal aid for poor and marginalized citizens.",
    ngoHelp: "Various NGOs provide legal assistance: BRAC, Ain o Salish Kendra (ASK), Bangladesh National Women Lawyers Association.",
  }
};

// Enhanced search function for any legal query
function findRelevantLegalInfo(query) {
  const queryLower = query.toLowerCase();
  const relevantInfo = [];
  
  // Check each category and content for relevance
  for (const [category, contents] of Object.entries(LEGAL_KNOWLEDGE_BASE)) {
    for (const [key, content] of Object.entries(contents)) {
      const contentLower = content.toLowerCase();
      let relevanceScore = 0;
      
      // Keyword matching
      const keywords = queryLower.split(' ').filter(w => w.length > 3);
      for (const keyword of keywords) {
        if (contentLower.includes(keyword)) relevanceScore += 2;
      }
      
      // Category-based boosting
      if (queryLower.includes('land') || queryLower.includes('জমি') || queryLower.includes('property')) {
        if (category === 'landPropertyLaw') relevanceScore += 5;
      }
      if (queryLower.includes('women') || queryLower.includes('নারী') || queryLower.includes('dowry') || queryLower.includes('যৌতুক')) {
        if (category === 'womenChildRights') relevanceScore += 5;
      }
      if (queryLower.includes('labour') || queryLower.includes('শ্রম') || queryLower.includes('worker')) {
        if (category === 'laborLaw') relevanceScore += 5;
      }
      if (queryLower.includes('cyber') || queryLower.includes('ডিজিটাল') || queryLower.includes('hack')) {
        if (category === 'cyberLaw') relevanceScore += 5;
      }
      if (queryLower.includes('arrest') || queryLower.includes('গ্রেপ্তার') || queryLower.includes('police')) {
        if (category === 'criminalProcedure') relevanceScore += 5;
      }
      if (queryLower.includes('marriage') || queryLower.includes('বিবাহ') || queryLower.includes('divorce')) {
        if (category === 'familyLaw') relevanceScore += 5;
      }
      if (queryLower.includes('fundamental') || queryLower.includes('মৌলিক') || queryLower.includes('rights')) {
        if (category === 'fundamentalRights') relevanceScore += 5;
      }
      if (queryLower.includes('consumer') || queryLower.includes('ভোক্তা')) {
        if (category === 'consumerRights') relevanceScore += 5;
      }
      
      // Article number matching
      const articleMatch = queryLower.match(/article\s*(\d+)/i);
      if (articleMatch && key.includes(articleMatch[1])) relevanceScore += 8;
      
      if (relevanceScore >= 2) {
        relevantInfo.push({
          source: `${category}/${key}`,
          content: content,
          score: relevanceScore
        });
      }
    }
  }
  
  // Sort by relevance score (highest first)
  relevantInfo.sort((a, b) => b.score - a.score);
  
  // Return top 8 relevant sources (up to 8 for comprehensive context)
  return relevantInfo.slice(0, 8);
}

function buildLegalPrompt(userQuery, relevantLegalInfo) {
  let contextSection = '';
  
  if (relevantLegalInfo.length > 0) {
    contextSection = `\n\nRELEVANT LEGAL INFORMATION FROM BANGLADESH CONSTITUTION AND LAWS:\n`;
    contextSection += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    relevantLegalInfo.forEach((info, idx) => {
      contextSection += `\n📌 SOURCE: ${info.source}\n📖 CONTENT: ${info.content}\n`;
    });
    contextSection += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  }
  
  return `You are "জনসেতু Legal Assistant" - an expert AI legal advisor for citizens of Bangladesh. You provide accurate, comprehensive, and helpful legal information.

YOUR EXPERTISE:
- Bangladesh Constitution (all articles)
- Criminal Law (Penal Code 1860)
- Civil Law (CPC, Evidence Act, Limitation Act)
- Family Law (Muslim & Hindu laws)
- Labor Law (Labor Act 2006)
- Women & Child Rights laws
- Cyber Law (Digital Security Act 2018)
- Land & Property laws
- Consumer Rights laws

GUIDELINES:
1. Answer ALL legal questions related to Bangladesh law comprehensively
2. Provide specific articles, sections, and act names when available
3. Give practical advice citizens can follow (where to go, what to do)
4. Respond in the same language as the user (Bengali or English)
5. Be thorough but clear - cover both rights and remedies
6. Include legal procedures when relevant (how to file cases, where to complain)
7. Always end with: "For specific legal advice, consult a qualified lawyer"

ABSOLUTELY FORBIDDEN:
- DO NOT say "I cannot answer" for genuine legal questions
- DO NOT just give one-line generic responses
- DO NOT fail to provide remedies and procedures
- You MUST provide meaningful legal information for every legitimate legal query

USER QUESTION: "${userQuery}"

${contextSection}

Now provide a DETAILED, HELPFUL legal response as a Bangladeshi legal expert. Include relevant laws, procedures, and practical advice. If the query is about land, give specific steps. If about rights, explain the articles. If about crime, explain punishments and procedures. Be thorough and helpful!`;
}

async function callGeminiAPI(prompt) {
  // USING YOUR HARDCODED API KEY
  const API_KEY = "AIzaSyChMk8Sc6wrOaNHZRheuSdhjUs5vErns1c";
  
  console.log(`🔑 Using API Key: ${API_KEY.substring(0, 15)}...`);
  
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}";
  
  try {
    console.log('📡 Calling Gemini API for legal advice...');
    const response = await axios.post(API_URL, {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500,
        topP: 0.95,
        topK: 40,
      }
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 45000
    });
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const responseText = response.data.candidates[0].content.parts[0].text;
      console.log(`✅ Gemini response received (${responseText.length} characters)`);
      return responseText;
    }
    throw new Error('Invalid API response structure - no text in response');
  } catch (error) {
    console.error('❌ Gemini API Error Details:', error.response?.data || error.message);
    
    // Don't throw - return fallback with actual legal info
    return null;
  }
}

async function getLegalAnswer(userQuery) {
  try {
    console.log(`\n🔍 PROCESSING LEGAL QUERY: "${userQuery}"`);
    console.log(`📝 Query length: ${userQuery.length} characters`);
    
    // Step 1: Find relevant legal information (RAG)
    const relevantLegalInfo = findRelevantLegalInfo(userQuery);
    console.log(`📚 Found ${relevantLegalInfo.length} relevant legal sources`);
    
    if (relevantLegalInfo.length > 0) {
      console.log(`📖 Top sources: ${relevantLegalInfo.slice(0, 3).map(i => i.source).join(', ')}`);
    }
    
    // Step 2: Build prompt with legal context
    const prompt = buildLegalPrompt(userQuery, relevantLegalInfo);
    console.log(`📝 Prompt built (${prompt.length} chars)`);
    
    // Step 3: Call Gemini API
    const aiResponse = await callGeminiAPI(prompt);
    
    // Step 4: If API works, return AI response with disclaimer
    if (aiResponse) {
      const disclaimer = "\n\n---\n> ⚖️ **দাবি পরিত্যাগ | Disclaimer**: এই তথ্য শুধুমাত্র সাধারণ জ্ঞানের জন্য। নির্দিষ্ট আইনি পরামর্শের জন্য পেশাদার আইনজীবীর সাথে পরামর্শ করুন।\n> This information is for general knowledge only. Please consult a qualified lawyer for specific legal advice.";
      
      return aiResponse + disclaimer;
    }
    
    // Step 5: FALLBACK - If Gemini fails, use knowledge base directly
    console.log('⚠️ Gemini API failed, using knowledge base fallback');
    
    let fallbackResponse = `📋 **আইনি তথ্য | Legal Information**\n\n`;
    fallbackResponse += `আপনার প্রশ্ন: "${userQuery}"\n\n`;
    fallbackResponse += `বাংলাদেশের আইন অনুযায়ী:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (relevantLegalInfo.length > 0) {
      relevantLegalInfo.forEach((info, idx) => {
        fallbackResponse += `📌 ${info.content}\n\n`;
      });
    } else {
      fallbackResponse += `এই বিষয়ে বিস্তারিত আইনি তথ্যের জন্য অনুগ্রহ করে:\n`;
      fallbackResponse += `• স্থানীয় আইনজীবীর সাথে পরামর্শ করুন\n`;
      fallbackResponse += `• ন্যাশনাল লিগ্যাল এইড (BLAST) এ যোগাযোগ করুন: 16430\n`;
      fallbackResponse += `• জাতীয় জরুরি সেবা 999-এ কল করুন\n\n`;
    }
    
    fallbackResponse += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    fallbackResponse += `> ⚖️ **সতর্কতা**: এই তথ্য শুধুমাত্র সাধারণ জ্ঞানের জন্য। নির্দিষ্ট আইনি পরামর্শের জন্য পেশাদার আইনজীবীর সাথে পরামর্শ করুন।`;
    
    return fallbackResponse;
    
  } catch (error) {
    console.error('❌ RAG Service Fatal Error:', error);
    return `দুঃখিত, প্রযুক্তিগত সমস্যার কারণে আপনার প্রশ্নের উত্তর দিতে পারছি না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।

Sorry, I'm unable to answer your question due to a technical issue. Please try again in a moment.

আপনি জরুরি আইনি সহায়তার জন্য কল করতে পারেন:
📞 BLAST (Legal Aid): 16430
📞 জাতীয় জরুরি সেবা: 999`;
  }
}

module.exports = { getLegalAnswer };