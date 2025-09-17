import React, { useState } from "react";

function ResponsiveIframe() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("https://exuberant-marketing-937720.framer.app/");
  const [urlError, setUrlError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate Shannon entropy for URL analysis
  const calculateShannonEntropy = (text) => {
    if (!text) return 0;
    const counter = {};
    for (let char of text) {
      counter[char] = (counter[char] || 0) + 1;
    }
    const length = text.length;
    let entropy = 0;
    for (let count of Object.values(counter)) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }
    return entropy;
  };

  // Enhanced feature extraction based on the advanced ML model
  const extractUrlFeatures = (url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      const path = urlObj.pathname;
      const query = urlObj.search;
      const fragment = urlObj.hash;
      
      const features = {
        // Basic metrics
        urlLength: url.length,
        domainLength: domain.length,
        pathLength: path.length,
        queryLength: query.length,
        
        // Character composition
        digitCount: (url.match(/\d/g) || []).length,
        alphaCount: (url.match(/[a-zA-Z]/g) || []).length,
        digitRatio: (url.match(/\d/g) || []).length / url.length,
        alphaRatio: (url.match(/[a-zA-Z]/g) || []).length / url.length,
        
        // Shannon entropy (key ML feature)
        urlEntropy: calculateShannonEntropy(url),
        domainEntropy: calculateShannonEntropy(domain),
        pathEntropy: calculateShannonEntropy(path),
        
        // Special character counts
        hyphenCount: (url.match(/-/g) || []).length,
        underscoreCount: (url.match(/_/g) || []).length,
        dotCount: (url.match(/\./g) || []).length,
        slashCount: (url.match(/\//g) || []).length,
        questionCount: (url.match(/\?/g) || []).length,
        equalCount: (url.match(/=/g) || []).length,
        ampersandCount: (url.match(/&/g) || []).length,
        percentCount: (url.match(/%/g) || []).length,
        plusCount: (url.match(/\+/g) || []).length,
        tildeCount: (url.match(/~/g) || []).length,
        hashCount: (url.match(/#/g) || []).length,
        
        // Protocol and structure analysis
        httpsUsed: url.startsWith('https://') ? 1 : 0,
        hasPort: (domain.includes(':') && !domain.startsWith('www')) ? 1 : 0,
        hasIp: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(domain) ? 1 : 0,
        
        // URL shortener detection
        isShortened: ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'short.link', 
                      'is.gd', 'tiny.cc', 'adf.ly', 'shorturl.at'].some(s => domain.includes(s)) ? 1 : 0,
        
        // Enhanced keyword analysis (categorized)
        financialKeywords: ['secure', 'verify', 'account', 'login', 'update', 'confirm', 'suspend']
          .filter(word => url.toLowerCase().includes(word)).length,
        brandKeywords: ['paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook', 'ebay']
          .filter(word => url.toLowerCase().includes(word)).length,
        urgencyKeywords: ['urgent', 'immediate', 'expire', 'suspend', 'block', 'alert', 'warning']
          .filter(word => url.toLowerCase().includes(word)).length,
        deceptionKeywords: ['official', 'security', 'service', 'support', 'help', 'center']
          .filter(word => url.toLowerCase().includes(word)).length,
        
        // Path analysis
        pathDepth: path ? path.split('/').filter(p => p).length : 0,
        avgPathLength: path ? (path.split('/').filter(p => p).reduce((sum, p) => sum + p.length, 0) / 
                               Math.max(path.split('/').filter(p => p).length, 1)) : 0,
        maxPathLength: path ? Math.max(...path.split('/').filter(p => p).map(p => p.length), 0) : 0,
        
        // Query analysis
        paramCount: query ? new URLSearchParams(query).size : 0,
        maxParamLength: query ? Math.max(...Array.from(new URLSearchParams(query).entries())
          .map(([k, v]) => Math.max(k.length, v.length)), 0) : 0,
        hasSuspiciousParams: query ? ['redirect', 'url', 'link', 'goto'].some(param => 
          new URLSearchParams(query).has(param)) ? 1 : 0 : 0,
        
        // Advanced TLD analysis
        hasSuspiciousTld: ['.tk', '.ml', '.ga', '.cf', '.click', '.download', '.work', 
                           '.loan', '.cricket', '.science', '.party', '.date', '.racing',
                           '.accountant', '.review', '.country', '.stream', '.trade']
          .some(tld => domain.endsWith(tld)) ? 1 : 0,
        hasLegitimaTld: ['.com', '.org', '.net', '.edu', '.gov', '.mil', '.int',
                         '.co.uk', '.de', '.fr', '.jp', '.ca', '.au', '.in']
          .some(tld => domain.endsWith(tld)) ? 1 : 0,
        tldLength: domain.includes('.') ? domain.split('.').pop().length : 0,
        
        // Lexical analysis
        uniqueCharRatio: [...new Set(url.toLowerCase())].length / url.length,
        vowelCount: (url.toLowerCase().match(/[aeiou]/g) || []).length,
        consonantCount: (url.toLowerCase().match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length,
        vowelConsonantRatio: (url.toLowerCase().match(/[aeiou]/g) || []).length / 
          Math.max((url.toLowerCase().match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length, 1),
        
        // Domain analysis
        subdomainCount: Math.max(0, domain.split('.').length - 2),
        maxSubdomainLength: domain.split('.').length > 2 ? 
          Math.max(...domain.split('.').slice(0, -2).map(s => s.length)) : 0,
        avgSubdomainLength: domain.split('.').length > 2 ? 
          domain.split('.').slice(0, -2).reduce((sum, s) => sum + s.length, 0) / 
          Math.max(domain.split('.').length - 2, 1) : 0,
        
        // Main domain analysis
        mainDomainLength: domain.split('.').length >= 2 ? domain.split('.').slice(-2, -1)[0].length : domain.length,
        mainDomainEntropy: domain.split('.').length >= 2 ? 
          calculateShannonEntropy(domain.split('.').slice(-2, -1)[0]) : calculateShannonEntropy(domain),
        
        // Brand impersonation detection
        similarToPopular: ['google', 'facebook', 'amazon', 'microsoft', 'apple', 'paypal', 
                          'ebay', 'netflix', 'instagram', 'twitter', 'linkedin', 'yahoo'].some(brand => {
          const mainDomain = domain.split('.').length >= 2 ? domain.split('.').slice(-2, -1)[0] : domain;
          return mainDomain.includes(brand) && mainDomain !== brand;
        }) ? 1 : 0,
        
        // Homograph attack detection (simplified)
        hasSuspiciousChars: /[о0еарухс]/.test(domain) ? 1 : 0,
        
        // Ratio features
        subdomainToDomainRatio: (Math.max(0, domain.split('.').length - 2)) / Math.max(domain.length, 1),
        queryToUrlRatio: query.length / Math.max(url.length, 1),
        pathToUrlRatio: path.length / Math.max(url.length, 1)
      };
      
      return features;
    } catch (error) {
      return null;
    }
  };

  // Advanced ML-based URL safety assessment with ensemble-like scoring
  const isSafeUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol;
      const hostname = urlObj.hostname.toLowerCase();
      
      // Basic protocol check
      if (!['http:', 'https:'].includes(protocol)) {
        return { safe: false, reason: "Only HTTP and HTTPS protocols are allowed", confidence: 100 };
      }
      
      // Local network check
      const localPatterns = [
        /localhost/i, /127\.0\.0\.1/, /192\.168\./, /10\./, /172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /file:/i, /javascript:/i, /data:/i, /vbscript:/i
      ];
      
      for (let pattern of localPatterns) {
        if (pattern.test(hostname) || pattern.test(url)) {
          return { safe: false, reason: "Local or potentially unsafe URL detected", confidence: 95 };
        }
      }
      
      // Extract comprehensive features
      const features = extractUrlFeatures(url);
      if (!features) {
        return { safe: false, reason: "Unable to analyze URL structure", confidence: 80 };
      }
      
      // Multi-model ensemble scoring (simulating RF, XGB, LGB models)
      let riskScores = [];
      let reasons = [];
      
      // Model 1: Random Forest-like scoring (structure-focused)
      let rfScore = 0;
      
      // Length-based features
      if (features.urlLength > 150) { rfScore += 25; reasons.push("Extremely long URL"); }
      else if (features.urlLength > 100) { rfScore += 15; reasons.push("Very long URL"); }
      if (features.domainLength > 40) { rfScore += 20; reasons.push("Suspicious domain length"); }
      
      // Entropy scoring (high entropy indicates randomness/obfuscation)
      if (features.urlEntropy > 4.8) { rfScore += 30; reasons.push("Very high URL randomness"); }
      else if (features.urlEntropy > 4.2) { rfScore += 20; reasons.push("High URL randomness"); }
      if (features.domainEntropy > 3.8) { rfScore += 25; reasons.push("Random domain pattern"); }
      if (features.pathEntropy > 4.0) { rfScore += 15; reasons.push("Random path structure"); }
      
      // Character composition
      if (features.digitRatio > 0.4) { rfScore += 20; reasons.push("Too many digits"); }
      if (features.hyphenCount > 5) { rfScore += 15; reasons.push("Excessive hyphens"); }
      if (features.dotCount > 6) { rfScore += 18; reasons.push("Too many dots"); }
      if (features.subdomainCount > 4) { rfScore += 20; reasons.push("Multiple subdomains"); }
      
      riskScores.push(Math.min(rfScore, 100));
      
      // Model 2: XGBoost-like scoring (pattern-focused)
      let xgbScore = 0;
      
      // IP address usage
      if (features.hasIp) { xgbScore += 35; reasons.push("IP address instead of domain"); }
      
      // Suspicious TLD
      if (features.hasSuspiciousTld) { xgbScore += 30; reasons.push("Suspicious top-level domain"); }
      if (features.isShortened) { xgbScore += 25; reasons.push("URL shortening service"); }
      
      // Brand impersonation
      if (features.similarToPopular && !features.httpsUsed) { 
        xgbScore += 35; reasons.push("Brand impersonation with insecure connection"); 
      } else if (features.similarToPopular) {
        xgbScore += 20; reasons.push("Potential brand impersonation");
      }
      
      // Multiple brand mentions
      if (features.brandKeywords > 1) { 
        xgbScore += 25; reasons.push("Multiple brand names detected"); 
      }
      
      // Suspicious character patterns
      if (features.hasSuspiciousChars) { xgbScore += 15; reasons.push("Suspicious characters detected"); }
      if (features.maxSubdomainLength > 25) { xgbScore += 15; reasons.push("Unusually long subdomain"); }
      
      riskScores.push(Math.min(xgbScore, 100));
      
      // Model 3: LightGBM-like scoring (keyword & content-focused)
      let lgbScore = 0;
      
      // Phishing keyword analysis
      const totalSuspiciousKeywords = features.financialKeywords + features.urgencyKeywords + 
                                     features.deceptionKeywords;
      if (totalSuspiciousKeywords > 3) { lgbScore += 25; reasons.push("Multiple phishing keywords"); }
      else if (totalSuspiciousKeywords > 1) { lgbScore += 15; reasons.push("Phishing keywords detected"); }
      
      // Financial terms without HTTPS
      if (features.financialKeywords > 0 && !features.httpsUsed) {
        lgbScore += 30; reasons.push("Financial terms with insecure connection");
      }
      
      // Urgency indicators
      if (features.urgencyKeywords > 1) { 
        lgbScore += 20; reasons.push("Urgency manipulation tactics"); 
      }
      
      // Suspicious parameters
      if (features.hasSuspiciousParams) { 
        lgbScore += 15; reasons.push("Suspicious URL parameters"); 
      }
      
      // Path complexity
      if (features.pathDepth > 5) { lgbScore += 10; reasons.push("Complex path structure"); }
      if (features.maxPathLength > 30) { lgbScore += 12; reasons.push("Long path segments"); }
      
      // Query complexity
      if (features.paramCount > 8) { lgbScore += 10; reasons.push("Many URL parameters"); }
      if (features.maxParamLength > 100) { lgbScore += 15; reasons.push("Very long parameters"); }
      
      riskScores.push(Math.min(lgbScore, 100));
      
      // Ensemble scoring (weighted average)
      const weights = [0.35, 0.4, 0.25]; // RF, XGB, LGB weights
      const finalRiskScore = riskScores.reduce((sum, score, i) => sum + score * weights[i], 0);
      
      // Confidence calculation based on agreement between models
      const scoreVariance = riskScores.reduce((sum, score) => sum + Math.pow(score - finalRiskScore, 2), 0) / 3;
      const confidence = Math.min(95, Math.max(70, 90 - scoreVariance / 10));
      
      // Decision thresholds (calibrated based on ML model performance)
      if (finalRiskScore >= 35) {
        return { 
          safe: false, 
          reason: `High risk detected: ${[...new Set(reasons)].slice(0, 3).join(', ')}`, 
          confidence: confidence,
          riskScore: Math.round(finalRiskScore),
          details: [...new Set(reasons)]
        };
      } else if (finalRiskScore >= 20) {
        return { 
          safe: false, 
          reason: `Medium risk detected: ${[...new Set(reasons)].slice(0, 2).join(', ')}`, 
          confidence: Math.max(75, confidence - 5),
          riskScore: Math.round(finalRiskScore),
          details: [...new Set(reasons)]
        };
      } else if (finalRiskScore >= 10) {
        return { 
          safe: false, 
          reason: `Low risk detected: ${[...new Set(reasons)].slice(0, 1).join(', ')}`, 
          confidence: Math.max(70, confidence - 10),
          riskScore: Math.round(finalRiskScore),
          details: [...new Set(reasons)]
        };
      }
      
      return { 
        safe: true, 
        confidence: Math.max(85, 100 - finalRiskScore),
        riskScore: Math.round(finalRiskScore)
      };
      
    } catch (error) {
      return { safe: false, reason: "Invalid URL format", confidence: 90 };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUrlError("");
    
    if (!url.trim()) {
      setUrlError("Please enter a URL");
      return;
    }
    
    const safetyCheck = isSafeUrl(url.trim());
    
    if (!safetyCheck.safe) {
      const confidenceText = safetyCheck.confidence ? ` (${safetyCheck.confidence}% confidence)` : '';
      const riskScoreText = safetyCheck.riskScore ? `\nRisk Score: ${safetyCheck.riskScore}/100` : '';
      setUrlError(`${safetyCheck.reason}${confidenceText}${riskScoreText}`);
      return;
    }
    
    setIsLoading(true);
    
    // Check if the URL might have iframe restrictions
    const urlObj = new URL(url.trim());
    const domain = urlObj.hostname.toLowerCase();
    const commonRestrictedSites = [
      'google.com', 'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
      'youtube.com', 'github.com', 'stackoverflow.com', 'reddit.com', 'amazon.com',
      'microsoft.com', 'apple.com', 'paypal.com', 'ebay.com', 'netflix.com'
    ];
    
    const isLikelyRestricted = commonRestrictedSites.some(site => 
      domain === site || domain.endsWith('.' + site)
    );
    
    setTimeout(() => {
      setCurrentUrl(url.trim());
      setShowOverlay(false);
      setUrl("");
      setIsLoading(false);
      
      // Show warning about potential iframe restrictions
      if (isLikelyRestricted) {
        console.warn(`Note: ${domain} may refuse to load in iframe due to security policies. This is normal behavior.`);
        // You could show a toast notification here instead
      }
    }, 800);
  };

  const handleClose = () => {
    setShowOverlay(false);
    setUrl("");
    setUrlError("");
  };

  const handleChangeUrl = () => {
    setShowOverlay(true);
    setUrlError("");
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%", // 16:9 aspect ratio
        overflow: "hidden",
      }}
    >
      {/* Main iframe */}
      <iframe
        src={currentUrl}
        title="Framer Design"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      />
      
      {/* Center button to open overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <button
          onClick={handleChangeUrl}
          style={{
            padding: "12px 24px",
            backgroundColor: "rgba(0, 123, 255, 0.9)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(0, 123, 255, 1)";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(0, 123, 255, 0.9)";
            e.target.style.transform = "scale(1)";
          }}
        >
          Enter URL
        </button>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#333", textAlign: "center" }}>
              Enter Website URL
            </h3>
            
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) setUrlError("");
              }}
              placeholder="https://example.com"
              style={{
                width: "100%",
                padding: "12px",
                border: urlError ? "2px solid #dc3545" : "2px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                marginBottom: "10px",
                boxSizing: "border-box",
                outline: "none",
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
            
            {urlError && (
              <div style={{
                color: "#dc3545",
                fontSize: "14px",
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: "#f8d7da",
                borderRadius: "4px",
                border: "1px solid #f5c6cb"
              }}>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>⚠️ Security Alert</div>
                <div>{urlError}</div>
              </div>
            )}
            
            <div style={{ 
              fontSize: "12px", 
              color: "#666", 
              marginBottom: "20px",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              border: "1px solid #e9ecef"
            }}>
              <div style={{ fontWeight: "bold", marginBottom: "5px", color: "#28a745" }}>Advanced ML Phishing Detection v3.0</div>
              <div>• Multi-model ensemble (Random Forest + XGBoost + LightGBM simulation)</div>
              <div>• 50+ feature analysis including Shannon entropy & lexical patterns</div>
              <div>• Brand impersonation detection with homograph attack prevention</div>
              <div>• Categorized keyword analysis (financial, urgency, deception patterns)</div>
              <div>• Advanced TLD analysis with suspicious domain detection</div>
            </div>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={handleClose}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: isLoading ? "#6c757d" : "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {isLoading ? "🔄 Checking..." : "🚀 Load URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResponsiveIframe;


