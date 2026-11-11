import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Award, AlertCircle, FileCheck2 } from 'lucide-react';
import { quizAPI } from '../../services/api';
import toast from 'react-hot-toast';

const QuizPlayer = ({ quizId, onBackToList }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizAPI.getById(quizId);
        setQuiz(res.data.data);
        setTimeLeft((res.data.data.timeLimit || 10) * 60);
      } catch (err) {
        toast.error('Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Timer Countdown
  useEffect(() => {
    if (result || loading || !quiz) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result, loading, quiz]);

  const handleSelectOption = optionIndex => {
    if (result) return;
    const currentQ = quiz.questions[currentIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleAutoSubmit = () => {
    toast.error('Time limit reached! Submitting your answers automatically.');
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const answersPayload = Object.keys(selectedAnswers).map(qId => ({
        questionId: qId,
        selectedAnswer: selectedAnswers[qId],
      }));

      const res = await quizAPI.submit(quizId, answersPayload);
      setResult(res.data.data);
      toast.success('Assessment submitted successfully!');
    } catch (err) {
      toast.error('Error submitting assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setTimeLeft((quiz?.timeLimit || 10) * 60);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-serif">Preparing Indian Heritage Assessment...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-cream-200">
        <p className="text-red-600 font-semibold mb-4">Quiz could not be loaded.</p>
        <button
          onClick={onBackToList}
          className="px-4 py-2 rounded-xl bg-royal-950 text-white font-semibold text-sm"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  // Format time mm:ss
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // If Quiz is Completed -> Show Result Page
  if (result) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-xl animate-in fade-in duration-300">
        {/* Result Header */}
        <div className="text-center pb-8 border-b border-cream-200">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {result.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {result.passed ? 'Assessment Passed' : 'Needs Review'}
          </span>

          <h2 className="font-serif text-3xl font-bold text-royal-950 mt-3 mb-2">{result.quizTitle}</h2>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-center min-w-[120px]">
              <span className="block text-3xl font-extrabold text-royal-950">{result.score} / {result.totalQuestions}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase">Correct Answers</span>
            </div>
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-center min-w-[120px]">
              <span className="block text-3xl font-extrabold text-saffron-600">{result.percentage}%</span>
              <span className="text-xs text-slate-500 font-semibold uppercase">Overall Accuracy</span>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="py-8 space-y-6">
          <h3 className="font-serif text-xl font-bold text-royal-950 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-gold-600" />
            <span>Detailed Question Review & Explanations</span>
          </h3>

          <div className="space-y-5">
            {result.detailedResults.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-5 rounded-2xl border transition-all ${
                  item.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-bold text-sm text-royal-950">
                    Question {idx + 1}: {item.question}
                  </span>
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  {item.options.map((opt, optIdx) => {
                    const isUserChoice = item.selectedAnswer === optIdx;
                    const isCorrectAnswer = item.correctAnswer === optIdx;
                    let style = 'bg-white border-slate-200 text-slate-700';

                    if (isCorrectAnswer) {
                      style = 'bg-emerald-100 border-emerald-400 font-bold text-emerald-950';
                    } else if (isUserChoice && !isCorrectAnswer) {
                      style = 'bg-rose-100 border-rose-400 line-through text-rose-950';
                    }

                    return (
                      <div key={optIdx} className={`p-2.5 rounded-lg border ${style}`}>
                        <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-cream-200">
                    <span className="font-bold text-royal-900 block mb-0.5">Historical Explanation:</span>
                    <span>{item.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleRetake}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-cream-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={onBackToList}
            className="px-6 py-2.5 rounded-xl bg-royal-950 hover:bg-saffron-600 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
          >
            <span>Back to All Quizzes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const currentQ = quiz.questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / quiz.questions.length) * 100;
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-xl">
      {/* Top Header with Timer & Progress */}
      <div className="flex items-center justify-between pb-6 border-b border-cream-200">
        <div>
          <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">
            {quiz.category} • {quiz.difficulty}
          </span>
          <h2 className="font-serif text-2xl font-bold text-royal-950 truncate max-w-md">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-2 bg-royal-950 text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-sm">
          <Clock className="w-4 h-4 text-gold-amber" />
          <span className={timeLeft < 120 ? 'text-red-400 animate-pulse' : ''}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pt-6">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progressPercent)}% Completed</span>
        </div>
        <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-saffron-600 to-gold-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="py-8">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-royal-950 leading-relaxed mb-6">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedAnswers[currentQ.id] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${
                  isSelected
                    ? 'border-saffron-600 bg-saffron-50/70 shadow-sm'
                    : 'border-cream-200 hover:border-gold-400 bg-white hover:bg-cream-50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-saffron-600 text-white'
                      : 'bg-cream-100 text-royal-900 group-hover:bg-gold-200'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className={`text-sm sm:text-base ${isSelected ? 'font-bold text-royal-950' : 'text-slate-800'}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-cream-200 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-cream-100 text-slate-700 font-semibold text-sm disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-royal-950 hover:bg-royal-900 text-white font-bold text-sm shadow flex items-center gap-2"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span>Calculating Score...</span>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
