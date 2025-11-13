"use client";

import React, { useState } from "react";

interface FlowIDs {
  chemistry: string;
  economics: string;
  spanish: string;
}

const FLOWS: FlowIDs = {
  chemistry: "9147521d-82ba-4e49-8086-1376a16c7da3",
  economics: "1a382f34-06b2-47ba-af61-f73f8df45286",
  spanish: "1a382f34-06b2-47ba-af61-f73f8df45286",
};

const API_HOST = "http://localhost:3500/v1.0/bindings/flowise-binding";

export default function FlowiseButtonQuiz() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[] | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showAnswerInput, setShowAnswerInput] = useState(false);

  async function sendQuiz(topic: keyof FlowIDs, selectedAnswer?: string) {
    setLoading(true);
    setError(null);
    
    if (!selectedAnswer) {
      setCurrentTopic(topic);
      setQuestion(null);
      setOptions(null);
      setDisplayText(null);
      setUserAnswer("");
      setShowAnswerInput(false);
    }

    const flowId = FLOWS[topic];
    if (!flowId) {
      setError("Flow ID missing for " + topic);
      setLoading(false);
      return;
    }

    const API_URL = `${API_HOST}/api/v1/prediction/${flowId}`;
    const CHAT_ID = `${topic}-session-001`;

    try {
      // If user typed an answer, use that. Otherwise use the selected option.
      const finalAnswer = userAnswer && !selectedAnswer ? userAnswer : selectedAnswer;
      
      const payload = {
        question: finalAnswer ? finalAnswer : `Start ${topic} quiz.`,
        chatId: CHAT_ID,
      };
      
     const res = await fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    operation: "post",
    data: payload,
  }),
});
      const data = await res.json();
      const text = data?.text || data?.response || data?.message || "No response";
      
      console.log("Raw AI Response:", text); // Debug log
      
      // Process the response
      const lines = text
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean);

      processQuizResponse(lines, topic);
      
      // Reset answer input after sending
      setUserAnswer("");
      setShowAnswerInput(false);
      
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    }
    setLoading(false);
  }

  function processQuizResponse(lines: string[], topic: string) {
    console.log("Processing lines:", lines); // Debug log
    
    const cleanLines = lines.filter(line => !isUnwantedLine(line));
    
    // Look for different types of content
    const numberedOptions = cleanLines.filter(line => isNumberedOption(line));
    const quizOptions = cleanLines.filter(line => isQuizOption(line));
    const questionLines = cleanLines.filter(line => isQuestionLine(line));
    
    console.log("Found:", { numberedOptions, quizOptions, questionLines }); // Debug log

    // Case 1: Topic selection screen with numbered options
    if (numberedOptions.length > 0) {
      const cleanOptions = numberedOptions.map(cleanOptionText);
      setOptions(cleanOptions);
      setQuestion(`Choose a ${topic} topic to continue:`);
      setDisplayText(getDisplayText(cleanLines, numberedOptions));
      setShowAnswerInput(false);
    }
    // Case 2: Quiz question with A), B), C), D) options
    else if (quizOptions.length > 0) {
      const questionLine = questionLines[0] || cleanLines.find(line => 
        line.length > 10 && !isQuizOption(line) && !isHeader(line)
      );
      setQuestion(questionLine ? cleanText(questionLine) : "Answer the question:");
      setOptions(quizOptions.map(cleanOptionText));
      setDisplayText(null);
      setShowAnswerInput(false);
    }
    // Case 3: Question without options - SHOW ANSWER INPUT
    else if (questionLines.length > 0) {
      const questionLine = questionLines[0];
      setQuestion(cleanText(questionLine));
      
      // For questions without options, show answer input and action buttons
      setOptions([
        "Submit Answer", 
        "I don't know", 
        "Skip this question",
        "Show hint"
      ]);
      setShowAnswerInput(true);
      setDisplayText(null);
    }
    // Case 4: Fallback
    else {
      const contentOptions = cleanLines.filter(line => 
        !isHeader(line) && 
        line.length > 5 &&
        !line.includes('Choose Different Subject')
      );
      
      if (contentOptions.length > 0) {
        setQuestion("Choose an option to continue:");
        setOptions(contentOptions.map(cleanOptionText));
        setDisplayText(getDisplayText(cleanLines, contentOptions));
        setShowAnswerInput(false);
      } else {
        setQuestion("Please continue:");
        setOptions(["Continue", "Next", "Proceed"]);
        setDisplayText(cleanLines.join('\n'));
        setShowAnswerInput(false);
      }
    }
  }

  const handleOptionClick = (option: string) => {
    if (option === "Submit Answer" && userAnswer.trim()) {
      // Send the user's typed answer
      sendQuiz(currentTopic as keyof FlowIDs, userAnswer);
    } else if (option === "I don't know") {
      sendQuiz(currentTopic as keyof FlowIDs, "I don't know the answer");
    } else if (option === "Skip this question") {
      sendQuiz(currentTopic as keyof FlowIDs, "Skip this question");
    } else if (option === "Show hint") {
      sendQuiz(currentTopic as keyof FlowIDs, "Give me a hint");
    } else {
      // For regular options
      sendQuiz(currentTopic as keyof FlowIDs, option);
    }
  };

  // Enhanced question detection
  const isQuestionLine = (line: string): boolean => {
    return line.includes('?') || 
           /^\d+\./.test(line) || // Numbered questions like "1. Question text"
           line.toLowerCase().includes('which') ||
           line.toLowerCase().includes('what') ||
           line.toLowerCase().includes('how') ||
           line.toLowerCase().includes('why') ||
           (line.length > 15 && !isHeader(line) && !isQuizOption(line));
  };

  // Clean unwanted characters and formatting
  function cleanOptionText(text: string): string {
    return text
 
      .trim();
  }

  function cleanText(text: string): string {
    return cleanOptionText(text)
     
  }

  // Get display text (headings and instructions)
  function getDisplayText(allLines: string[], options: string[]): string {
    const displayLines = allLines.filter(line => 
      !isUnwantedLine(line) && 
      !options.includes(line) &&
      (isHeader(line) || isInstruction(line))
    );
    
    return displayLines.map(cleanText).join('\n');
  }

  // Function to check if a line should be completely removed
  const isUnwantedLine = (line: string): boolean => {
    const unwantedPatterns = [
      '---',
      '— Choose Different Subject',
      '? Need help?',
      'GLOSSARY',
      'TEXTBOOK DEVELOPMENT COMMITTEE',
      'Reprint',
      'Reset Session',
      'Interactive AI-powered learning',
      'Search',
      '◼' // Checkbox characters
    ];
    
    return unwantedPatterns.some(pattern => 
      line.toLowerCase().includes(pattern.toLowerCase())
    ) || /^-\s*\[?\s*\]?\s*$/.test(line); // Empty checkboxes
  };

  // Function to check if a line is a header
  const isHeader = (line: string): boolean => {
    const headerIndicators = [
      'Swarise AI',
      'Choose Your Subject',
      'Select a subject',
      'Interactive Learning',
      'Quiz Assistant',
      'Interactive Quiz',
      'Current:',
      'Subjects',
      'Progress',
      'Settings',
      'CHOOSE THE TOPICS'
    ];
    return headerIndicators.some(indicator => 
      line.toLowerCase().includes(indicator.toLowerCase())
    ) || line.startsWith('#');
  };

  // Function to check if a line is an instruction
  const isInstruction = (line: string): boolean => {
    return line.toLowerCase().includes('choose') || 
           line.toLowerCase().includes('select') ||
           line.toLowerCase().includes('example') ||
           line.toLowerCase().includes('ex:');
  };

  // Function to check if a line is a numbered option
  const isNumberedOption = (line: string): boolean => {
    return /^\[?\d+\]/.test(line) || 
           /^\d+\./.test(line) || 
           /^\d+\)/.test(line) ||
           /\\\[\d+\\\]/.test(line);
  };

  // Function to check if a line is a quiz option (A, B, C, D)
  const isQuizOption = (line: string): boolean => {
  return /^[A-D][).:\-]/i.test(line) ||          // A), A., A: A-
         /^Option\s*[A-D][:.\-]/i.test(line) ||  // Option A: ...
         /^[A-D]\s+/.test(line);                 // A  Option
};

  function reset() {
    setCurrentTopic(null);
    setOptions(null);
    setQuestion(null);
    setDisplayText(null);
    setError(null);
    setLoading(false);
    setUserAnswer("");
    setShowAnswerInput(false);
  }

  return (
    <div className="ai-flow-container">
      <div className="ai-flow-content-wrapper">
        <div className="ai-flow-sidebar">
          <div className="ai-flow-header">
            <div className="ai-flow-icon">
              <i>🧪</i>
            </div>
            <div className="ai-flow-info">
              <strong>Quiz Assistant</strong>
              <p>Interactive Learning</p>
            </div>
          </div>
          
          <div className="ai-flow-menu">
            <button className="ai-flow-menu-item active">
              <i>📚</i>
              <span>Subjects</span>
            </button>
            <button className="ai-flow-menu-item">
              <i>📊</i>
              <span>Progress</span>
            </button>
            <button className="ai-flow-menu-item">
              <i>⚙️</i>
              <span>Settings</span>
            </button>
          </div>

          <div className="ai-flow-help">
            <i>❓</i>
            <span>Need help?</span>
          </div>
        </div>

        <div className="ai-flow-content">
          <div className="ai-flow-title">
            <div className="ai-flow-title-icon">
              <i>🎯</i>
            </div>
            <h1>Interactive Quiz</h1>
          </div>

          <div className="ai-flow-card">
            <div className="ai-flow-card-header">
              <h2>Choose Your Subject</h2>
              <p className="ai-flow-subtitle">
                Select a subject to start an interactive quiz session
              </p>
            </div>

            <div className="ai-flow-crumbs">
              <div className="ai-flow-crumb-container">
                <span className="ai-flow-crumb-label">Current:</span>
                <div className="crumb">
                  <span>{currentTopic ? `${currentTopic.charAt(0).toUpperCase() + currentTopic.slice(1)} Quiz` : 'Select Subject'}</span>
                </div>
              </div>
            </div>

            <div className="ai-flow-content-area">
              {!currentTopic && !options && (
                <div className="ai-flow-buttons">
                  <button
                    className="ai-flow-button"
                    onClick={() => sendQuiz("chemistry")}
                    disabled={loading}
                  >
                    {loading && <div className="ai-flow-spinner"></div>}
                    <i>🧪</i>
                    Chemistry
                  </button>
                  <button
                    className="ai-flow-button"
                    onClick={() => sendQuiz("economics")}
                    disabled={loading}
                  >
                    {loading && <div className="ai-flow-spinner"></div>}
                    <i>📈</i>
                    Economics
                  </button>
                  <button
                    className="ai-flow-button"
                    onClick={() => sendQuiz("spanish")}
                    disabled={loading}
                  >
                    {loading && <div className="ai-flow-spinner"></div>}
                    <i>🇪🇸</i>
                    Spanish
                  </button>
                </div>
              )}

              {error && (
                <div className="ai-flow-status ai-flow-status-error">
                  <i>⚠️</i>
                  {error}
                </div>
              )}

              {/* Display instructions or headings */}
              {displayText && (
                <div className="quiz-instructions">
                  <pre className="instruction-text">{displayText}</pre>
                </div>
              )}

              {/* Show question and options */}
              {question && (
                <div className="quiz-content">
                  <div className="question-container">
                    <h3 className="question-text">{question}</h3>
                  </div>

                  {/* Answer input for questions without options */}
                  {showAnswerInput && (
                    <div className="answer-input-container">
                      <div className="input-with-icon">
                        <input
                          type="text"
                          placeholder="Type your answer here..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          disabled={loading}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && userAnswer.trim()) {
                              handleOptionClick("Submit Answer");
                            }
                          }}
                        />
                      </div>
                      <p className="input-hint">
                        Press Enter or click "Submit Answer" to continue
                      </p>
                    </div>
                  )}

                  {options && options.length > 0 && (
                    <div className="options-container">
                      <div className="ai-flow-buttons">
                        {loading && (
                          <div className="ai-flow-status">
                            <div className="spinner"></div>
                            Loading...
                          </div>
                        )}
                        
                        {!loading && options.map((option, idx) => (
                          <button
                            key={idx}
                            className={`ai-flow-button option-button ${
                              option === "Submit Answer" && !userAnswer.trim() ? 'disabled-option' : ''
                            }`}
                            onClick={() => handleOptionClick(option)}
                            disabled={loading || (option === "Submit Answer" && !userAnswer.trim())}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!options && !loading && (
                    <div className="ai-flow-status">
                      <i>💡</i>
                      No options available. The AI might be waiting for your answer.
                    </div>
                  )}
                </div>
              )}

              {/* Show loading or empty states */}
              {currentTopic && !question && !loading && (
                <div className="ai-flow-status">
                  <i>⏳</i>
                  Preparing your {currentTopic} quiz...
                </div>
              )}

              {loading && !options && (
                <div className="ai-flow-status">
                  <div className="spinner"></div>
                  Starting your quiz session...
                </div>
              )}

              {/* Reset button */}
              {(currentTopic || options) && (
                <button
                  className="ai-flow-button ai-flow-button-full reset-button"
                  onClick={reset}
                  disabled={loading}
                >
                  <i>←</i>
                  Choose Different Subject
                </button>
              )}
            </div>

            <div className="ai-flow-footer">
              <button className="ai-flow-pill" onClick={reset}>
                <i>🔄</i>
                Reset Session
              </button>
              <div className="ai-flow-status">
                <i>💡</i>
                Interactive AI-powered learning
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}