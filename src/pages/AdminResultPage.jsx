import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell,
} from "recharts";
import { FileDown, Brain, TrendingUp, AlertTriangle, ArrowLeft, Mail } from 'lucide-react';
import apiService, { getUserFromToken, isTokenExpired } from "../APIs/AdminResultPageAPI";

const SurveyResult = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [analysis, setAnalysis] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const surveyId = location.state?.surveyId;
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800", "#9C27B0"];

  // Get user data from JWT token
  const userData = getUserFromToken();

  useEffect(() => {
    // Check authentication first
    if (!userData || isTokenExpired()) {
      setError("Authentication expired. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!surveyId) {
      setError("Survey ID is missing. Please go back and try again.");
      setLoading(false);
      return;
    }

    // Fetch required data
    const fetchData = async () => {
      try {
        // Fetch survey data
        const surveyData = await apiService.getSurveyData(surveyId);
        setSurveyData(surveyData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load survey data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyId, navigate]);

  useEffect(() => {
    if (surveyData) {
      generateAnalysis();
    }
  }, [surveyData]);

  const generateAnalysis = () => {
    if (!surveyData) return;

    const analysis = {
      overview: {
        totalQuestions: surveyData.questions.length,
        totalParticipants: surveyData.participantEmails ? surveyData.participantEmails.length : 0,
        participationRate: calculateParticipationRate(),
        completionStats: calculateCompletionStats(),
      },
      trends: identifyTrends(),
      insights: generateInsights(),
      recommendations: generateRecommendations(),
      timestamp: new Date().toISOString(),
    };

    setAnalysis(analysis);
  };

  const calculateCompletionStats = () => {
    // Calculate what percentage of questions have at least one response
    const totalQuestions = surveyData.questions.length;
    let questionsWithResponses = 0;
    
    surveyData.questions.forEach(question => {
      const totalVotes = question.options.reduce((sum, opt) => sum + opt.frequency, 0);
      if (totalVotes > 0) {
        questionsWithResponses++;
      }
    });
    
    return {
      questionsWithResponses,
      completionPercentage: Math.round((questionsWithResponses / totalQuestions) * 100)
    };
  };

  const calculateParticipationRate = () => {
    if (!surveyData) return 0;
    
    // If participationNo is provided, use it as the denominator
    if (surveyData.participationNo) {
      const participationNo = surveyData.participationNo || 1; // Avoid division by zero
      // Calculate participation rate based on actual participants
      const participationRate = (surveyData.participantEmails?.length || 0) / participationNo * 100;
      return Math.round(participationRate * 100) / 100;
    } else {
      // If participationNo is not provided, we can't calculate it properly
      // Just return 100% or some default value
      return 100;
    }
  };

  const identifyTrends = () => {
    const trends = [];

    surveyData.questions.forEach(question => {
      const options = question.options;
      const totalVotes = options.reduce((sum, opt) => sum + opt.frequency, 0);
      
      if (totalVotes === 0) return;
      
      const dominantOption = options.reduce((prev, current) =>
        (current.frequency > prev.frequency) ? current : prev
      );

      const dominanceRatio = dominantOption.frequency / totalVotes;

      if (dominanceRatio > 0.6) {
        trends.push({
          question: question.questionText,
          dominantOption: dominantOption.optionText,
          percentage: Math.round(dominanceRatio * 100),
          strength: dominanceRatio > 0.8 ? 'Very Strong' : 'Strong'
        });
      }
    });

    return trends;
  };

  const generateInsights = () => {
    const insights = [];

    if (surveyData.totalResponses < 5) {
      insights.push({
        type: 'warning',
        message: 'Low response count may affect the reliability of results'
      });
    }

    surveyData.questions.forEach(question => {
      const options = question.options;
      const totalVotes = options.reduce((sum, opt) => sum + opt.frequency, 0);
      
      if (totalVotes === 0) {
        insights.push({
          type: 'warning',
          message: `No responses for question: "${question.questionText}"`
        });
        return;
      }
      
      const frequencies = options.map(opt => opt.frequency / totalVotes);

      const isEvenlyDistributed = frequencies.every(freq =>
        Math.abs(freq - 1 / options.length) < 0.1
      );

      if (isEvenlyDistributed && totalVotes >= 5) {
        insights.push({
          type: 'info',
          message: `Mixed opinions on "${question.questionText}" - no clear consensus`
        });
      }
    });

    return insights;
  };

  const generateRecommendations = () => {
    const recommendations = [];

    if (surveyData.totalResponses < 10) {
      recommendations.push({
        priority: 'medium',
        action: 'Collect more responses',
        details: 'More responses would increase the reliability of results'
      });
    }

    // Look for questions with no clear consensus
    surveyData.questions.forEach(question => {
      const options = question.options;
      const totalVotes = options.reduce((sum, opt) => sum + opt.frequency, 0);
      
      if (totalVotes === 0) return;
      
      const frequencies = options.map(opt => opt.frequency / totalVotes);
      const highestFrequency = Math.max(...frequencies);
      
      if (highestFrequency < 0.4 && totalVotes >= 5) {
        recommendations.push({
          priority: 'low',
          action: 'Follow up on mixed opinions',
          details: `Question "${question.questionText}" has diverse answers and may need further investigation`
        });
      }
    });

    return recommendations;
  };

  const downloadReport = () => {
    if (!analysis) return;

    const report = `
SURVEY ANALYSIS REPORT
=====================
Survey Title: ${surveyData.surveyTitle}
Generated on: ${new Date(analysis.timestamp).toLocaleString()}

PARTICIPATION SUMMARY
--------------------
Total Participants: ${analysis.overview.totalParticipants}
Target Audience: ${surveyData.participationNo || 'Not specified'}
Audience Reach: ${analysis.overview.participationRate.toFixed(1)}%
Total Questions: ${analysis.overview.totalQuestions}
Questions with Responses: ${analysis.overview.completionStats.questionsWithResponses}/${analysis.overview.totalQuestions} (${analysis.overview.completionStats.completionPercentage}%)

PARTICIPANTS (${surveyData.participantEmails ? surveyData.participantEmails.length : 0})
-----------
${surveyData.participantEmails && surveyData.participantEmails.length > 0 
  ? surveyData.participantEmails.map((email, i) => `${i+1}. ${email}`).join('\n')
  : 'No participant emails available'
}

KEY TRENDS
----------
${analysis.trends.length > 0 
  ? analysis.trends.map(trend => `
• ${trend.question}
  - Dominant Choice: ${trend.dominantOption}
  - Support: ${trend.percentage}%
  - Trend Strength: ${trend.strength}
`).join('\n')
  : 'No significant trends identified.'
}

INSIGHTS
--------
${analysis.insights.length > 0
  ? analysis.insights.map(insight => `• ${insight.message}`).join('\n')
  : 'No specific insights generated based on the current data.'
}

RECOMMENDATIONS
--------------
${analysis.recommendations.length > 0
  ? analysis.recommendations.map(rec => `
[${rec.priority.toUpperCase()}] ${rec.action}
${rec.details}
`).join('\n')
  : 'No specific recommendations at this time.'
}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-analysis-${surveyId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  if (loading) return <div className="loading">Loading survey results...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg shadow-lg">
      <button 
        onClick={() => navigate('/admindashboard')} 
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="text-white" />
        Back to Dashboard
      </button>
      
      <header className="flex justify-between items-center mb-8 bg-white bg-opacity-70 p-4 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-blue-800 mb-3">{surveyData.surveyTitle}</h1>
          
          <div className="flex flex-wrap gap-4">
            {surveyData.participantEmails && (
              <div className="bg-blue-100 px-4 py-2 rounded-lg border border-blue-200 flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 font-bold">
                  {surveyData.participantEmails.length}
                </div>
                <span className="text-blue-800 font-medium">Survey Participants</span>
              </div>
            )}
            
            <div className="bg-purple-100 px-4 py-2 rounded-lg border border-purple-200 flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2 font-bold">
                {surveyData.questions.length}
              </div>
              <span className="text-purple-800 font-medium">Survey Questions</span>
            </div>
            
            <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-200 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs">
                {calculateParticipationRate().toFixed(1)}%
              </div>
              <span className="text-green-800 font-medium">Completion Rate</span>
            </div>  
          </div>
          
          {surveyData.participantEmails && surveyData.participantEmails.length > 0 && (
            <button 
              onClick={toggleParticipants} 
              className={`mt-3 px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${
                showParticipants 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              <Mail size={16} />
              {showParticipants ? 'Hide Participant List' : 'Show Participant List'}
            </button>
          )}
          
          {userData && <p className="text-blue-600 mt-3">User: {userData.email} ({userData.role})</p>}
        </div>
        <button onClick={downloadReport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all hover:shadow-lg">
          <FileDown className="text-white" />
          Download Analysis Report
        </button>
      </header>

      {showParticipants && surveyData.participantEmails && surveyData.participantEmails.length > 0 && (
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow mb-6 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-800">Participant Emails</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {surveyData.participantEmails.map((email, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-blue-800 truncate">{email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {analysis && (
        <div className="space-y-6">
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-purple-600" />
              <h2 className="text-xl font-semibold text-blue-800">AI Analysis Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-blue-800 font-medium mb-2">Participation Overview</h3>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Audience Reach:</span>
                    <span className="text-blue-700 font-medium">{analysis.overview.participationRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-4 bg-blue-100 rounded-full w-full">
                    <div 
                      className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                      style={{ width: `${analysis.overview.participationRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Shows what percentage of the target audience participated in the survey
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Question Coverage:</span>
                    <span className="text-blue-700 font-medium">{analysis.overview.completionStats.completionPercentage}%</span>
                  </div>
                  <div className="h-4 bg-blue-100 rounded-full w-full">
                    <div 
                      className="h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full" 
                      style={{ width: `${analysis.overview.completionStats.completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Shows what percentage of questions received at least one response
                  </p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-purple-800 font-medium mb-2">Survey Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-medium text-purple-800">{analysis.overview.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Participants:</span>
                    <span className="font-medium text-purple-800">{analysis.overview.totalParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions with responses:</span>
                    <span className="font-medium text-purple-800">
                      {analysis.overview.completionStats.questionsWithResponses} / {analysis.overview.totalQuestions}
                      <span className="text-gray-500 text-sm ml-1">
                        ({analysis.overview.completionStats.completionPercentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target audience reach:</span>
                    <span className="font-medium text-purple-800">{analysis.overview.participationRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {analysis.trends.length > 0 && (
            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-600" />
                <h2 className="text-xl font-semibold text-purple-800">Key Trends</h2>
              </div>
              <ul className="space-y-3">
                {analysis.trends.map((trend, index) => (
                  <li key={index} className="border-l-4 border-blue-400 pl-3 py-1">
                    <p className="font-medium text-blue-800">{trend.question}</p>
                    <p className="text-purple-700">
                      {trend.dominantOption} ({trend.percentage}% - {trend.strength})
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
  
          {analysis.insights.length > 0 && (
            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-purple-600" />
                <h2 className="text-xl font-semibold text-blue-800">Important Insights</h2>
              </div>
              <ul className="space-y-3">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className={`p-3 rounded-lg ${
                    insight.type === 'positive' ? 'bg-blue-100 text-blue-800' : 
                    insight.type === 'warning' ? 'bg-orange-100 text-orange-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
  
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setChartType(chartType === "bar" ? "pie" : "bar")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Switch to {chartType === "bar" ? "Pie Chart" : "Bar Chart"}
        </button>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {surveyData.questions.map((question) => {
          const chartData = question.options.map((option, index) => ({
            name: option.optionText,
            votes: option.frequency,
            color: COLORS[index % COLORS.length],
          }));

          return (
            <div key={question.questionId} className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">{question.questionText}</h2>
  
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === "bar" ? (
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0ff" />
                      <XAxis dataKey="name" stroke="#6366f1" />
                      <YAxis stroke="#6366f1" />
                      <Tooltip cursor={{ fill: "rgba(219, 234, 254, 0.4)" }} />
                      <Legend />
                      <Bar dataKey="votes" fill="#8b5cf6" barSize={30} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie 
                        data={chartData} 
                        dataKey="votes" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={120} 
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SurveyResult;