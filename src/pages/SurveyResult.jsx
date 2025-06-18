import React, { useEffect, useState } from "react";
import { useLocation,useParams } from "react-router-dom";
import { fetchSurveyResultsAPI, fetchUserResponsesAPI } from "../APIs/SurveyResultAPI"; // Import API functions
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText, FileDown, Brain, TrendingUp,
  AlertTriangle, CheckCircle, PieChart as PieChartIcon,
  BarChart as BarChartIcon,ArrowLeft
} from 'lucide-react';


const SurveyResult = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [analysis, setAnalysis] = useState(null);
    const { id } = useParams();
      const surveyId = id; 

  const location = useLocation();
  // const surveyId = location.state?.surveyId;

  useEffect(() => {
    if (!surveyId) {
      setError("Survey ID is missing. Please go back and try again.");
      setLoading(false);
      return;
    }

    const loadSurveyResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const surveyResults = await fetchSurveyResultsAPI(surveyId);
        setSurveyData(surveyResults);
        const responses = await fetchUserResponsesAPI(surveyId);
        setUserResponses(responses);
      } catch (err) {
        console.error("Error loading survey results:", err);
        setError(err.message || "Failed to load survey results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadSurveyResults();
  }, [surveyId]);

  useEffect(() => {
    if (surveyData && userResponses) {
      generateAnalysis();
    }
  }, [surveyData, userResponses]);

  const generateAnalysis = () => {
    if (!surveyData || !userResponses) return;

    const analysis = {
      overview: {
        totalQuestions: surveyData.questions.length,
        totalResponses: surveyData.totalResponses,
        participationRate: calculateParticipationRate(),
      },
      trends: identifyTrends(),
      insights: generateInsights(),
      recommendations: generateRecommendations(),
      timestamp: new Date().toISOString(),
    };

    setAnalysis(analysis);
  };

const calculateParticipationRate = () => {
  if (!surveyData || !surveyData.participationNo) return 0;
  
  // Calculate participation rate as (totalResponses / participationNo) * 100
  const totalResponses = surveyData.totalResponses || 0;
 // const totalquestion=surveyData.question.length || 1;
 const totalQuestions=surveyData.questions.length || 1;
  const participationNo = surveyData.participationNo || 1; // Avoid division by zero
  
  // Convert to percentage and round to 2 decimal places
  const totaluser = (totalResponses/totalQuestions);
  const participationRate = (totaluser/ participationNo) * 100;
  return Math.round(participationRate * 100) / 100;
};
  const identifyTrends = () => {
    const trends = [];

    surveyData.questions.forEach(question => {
      const options = question.options;
      const totalVotes = options.reduce((sum, opt) => sum + opt.frequency, 0);
      const dominantOption = options.reduce((prev, current) =>
        (current.frequency > prev.frequency) ? current : prev, { frequency: 0 }
      );

      const dominanceRatio = totalVotes > 0 ? dominantOption.frequency / totalVotes : 0;

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

    // Participation insight
    const participationRate = calculateParticipationRate();
    if (participationRate < 50) {
      insights.push({
        type: 'warning',
        message: 'Low participation rate may affect the reliability of results'
      });
    }

    // Consensus insights
    surveyData.questions.forEach(question => {
      const options = question.options;
      const totalVotes = options.reduce((sum, opt) => sum + opt.frequency, 0);
      const frequencies = options.map(opt => totalVotes > 0 ? opt.frequency / totalVotes : 0);

      // Check for even distribution
      const isEvenlyDistributed = frequencies.every(freq =>
        Math.abs(freq - 1 / options.length) < 0.1
      );

      if (isEvenlyDistributed && options.length > 1) {
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

    const participationRate = calculateParticipationRate();
    if (participationRate < 100 && surveyData?.questions) {
      const answeredQuestionIds = userResponses.map(res => Number(res.questionId));
      const unansweredQuestions = surveyData.questions.filter(question =>
        !answeredQuestionIds.includes(Number(question.questionId))
      );

      if (unansweredQuestions.length > 0) {
        recommendations.push({
          priority: 'high',
          action: 'Complete remaining questions',
          details: `${unansweredQuestions.length} questions remain unanswered`
        });
      }
    }

    return recommendations;
  };

  const downloadReport = () => {
    if (!analysis) return;

    const report = `
Survey Analysis Report
Generated on: ${new Date(analysis.timestamp).toLocaleString()}

OVERVIEW
--------
Total Questions: ${analysis.overview.totalQuestions}
Total Responses: ${analysis.overview.totalResponses}
Participation Rate: ${analysis.overview.participationRate.toFixed(1)}%

KEY TRENDS
----------
${analysis.trends.map(trend => `
• ${trend.question}
  - Dominant Choice: ${trend.dominantOption}
  - Support: ${trend.percentage}%
  - Trend Strength: ${trend.strength}
`).join('\n')}

INSIGHTS
--------
${analysis.insights.map(insight => `• ${insight.message}`).join('\n')}

RECOMMENDATIONS
--------------
${analysis.recommendations.map(rec => `
[${rec.priority.toUpperCase()}] ${rec.action}
${rec.details}
`).join('\n')}
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  if (loading) return <div className="loading">Loading survey results...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!surveyData) return <div>No survey data available.</div>;
  return (
   
<div className="relative w-full min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
      {/* Animated Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400 opacity-20 blur-3xl animate-pulse rounded-full top-0 left-0"></div>
        <div className="absolute w-full h-full bg-purple-400 opacity-30 blur-3xl animate-pulse rounded-full bottom-0 right-0"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button - Moved inside the main container */}
        <button 
          onClick={() => window.location.href = '/dashboard'} 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="text-white" />
          Back to Dashboard
        </button>
        
        {/* Header Section */}
        <header className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 mb-8 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-50 -z-10"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {surveyData?.surveyTitle}
              </h1>
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {surveyData?.totalResponses} responses collected
                </span>
              </div>
            </div>
            
            <button
              onClick={downloadReport}
              className="relative overflow-hidden group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Download Analysis Report
              </div>
            </button>
          </div>
        </header>
  
        {/* Analysis Dashboard */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Participation Rate Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 transform transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Participation</h2>
              </div>
              <div className="relative w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${analysis.overview.participationRate}%` }}
                />
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {analysis.overview.participationRate.toFixed(1)}%
                </span>
              </div>
            </div>
  
            {/* Trends Card */}
            {analysis.trends.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 transform transition-all hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Key Trends</h2>
                </div>
                <ul className="space-y-3">
                  {analysis.trends.map((trend, index) => (
                    <li 
                      key={index}
                      className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {trend.question}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-semibold">
                          {trend.dominantOption}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                          {trend.percentage}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
  
            {/* Insights Card */}
            {analysis.insights.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 transform transition-all hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Important Insights</h2>
                </div>
                <ul className="space-y-3">
                  {analysis.insights.map((insight, index) => (
                    <li
                      key={index}
                      className={`p-3 rounded-xl border-l-4 ${
                        insight.type === 'positive' 
                          ? 'border-blue-500 bg-blue-50' 
                          : insight.type === 'negative'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-500 bg-gray-50'
                      }`}
                    >
                      <p className="text-sm text-gray-700">{insight.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
  
        {/* Chart Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setChartType(chartType === "bar" ? "pie" : "bar")}
            className="px-4 py-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-md hover:bg-gray-100 transition-all flex items-center gap-2 text-blue-600"
          >
            Switch to {chartType === "bar" ? "Pie Chart" : "Bar Chart"}
          </button>
        </div>
  
      {/* Questions Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {surveyData.questions.map((question) => {
    const chartData = question.options.map((option, index) => ({
      name: option.optionText,
      votes: option.frequency,
      color: COLORS[index % COLORS.length],
    }));

    const userResponse = userResponses.find(
      (res) => Number(res.questionId) === Number(question.questionId)
    );
    const selectedOptionId = userResponse?.selectedOptionId;
    const selectedOption = question.options.find(
      (opt) => Number(opt.optionId) === Number(selectedOptionId)
    );

    return (
      <div 
        key={question.questionId}
        className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all hover:scale-[1.02]"
      >
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-50 -z-10"></div>

        {/* Question Header */}
        <div className="p-6 pb-4 border-b border-gray-100/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {question.questionText}
          </h2>
          
          {/* User Response Section */}
          {selectedOptionId && (
            <div className="mt-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: selectedOption ? 
                     `${COLORS[question.options.findIndex(opt => Number(opt.optionId) === Number(selectedOptionId)) % COLORS.length]}20` : 
                     'rgba(34, 197, 94, 0.2)'
                   }}
              >
                <CheckCircle className="w-5 h-5" 
                  style={{ color: selectedOption ? 
                    COLORS[question.options.findIndex(opt => Number(opt.optionId) === Number(selectedOptionId)) % COLORS.length] : 
                    '#16a34a'
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Your answer</p>
                <p className="font-semibold text-gray-900"
                   style={{ color: selectedOption ? 
                     COLORS[question.options.findIndex(opt => Number(opt.optionId) === Number(selectedOptionId)) % COLORS.length] : 
                     'currentColor'
                   }}
                >
                  {selectedOption?.optionText || 'Unknown'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="p-4 h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart 
                data={chartData}
                margin={{top: 5, right: 30, left: 20, bottom: 70}}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-gray-200 opacity-50" 
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  className="text-xs"
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  className="text-sm"
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name, props) => [`${value} votes`, props.payload.name]}
                />
                <Bar 
                  dataKey="votes" 
                  radius={[8, 8, 0, 0]}
                  className="shadow-lg"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
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
                  innerRadius={70}
                  paddingAngle={2}
                  labelLine={false}
                  label={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name, props) => [
                    `${value} votes (${((value / chartData.reduce((sum, entry) => sum + entry.votes, 0)) * 100).toFixed(1)}%)`, 
                    props.payload.name
                  ]}
                />
                <Legend 
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    maxWidth: '40%',
                    fontSize: '12px',
                    color: '#6B7280',
                    paddingLeft: '10px',
                    overflowWrap: 'break-word'
                  }}
                  formatter={(value, entry, index) => {
                    const item = chartData[index];
                    const percent = ((item.votes / chartData.reduce((sum, entry) => sum + entry.votes, 0)) * 100).toFixed(0);
                    return <span style={{ color: entry.color }}>{`${value} (${percent}%)`}</span>;
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  })}
</div>
  
        {/* Loading and Error States */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}
  
        {error && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="bg-red-50 p-8 rounded-2xl shadow-2xl max-w-md text-center">
              <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyResult;