import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const QuizCard = ({ quiz, userScore = null, onStartQuiz }) => {
  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 border-amber-300',
    Hard: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-cream-200 hover:border-gold-400 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-royal-100 text-royal-900 border border-royal-200">
            {quiz.category}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              difficultyColors[quiz.difficulty] || 'bg-slate-100 text-slate-800'
            }`}
          >
            {quiz.difficulty}
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold text-royal-950 group-hover:text-saffron-600 transition-colors mb-2">
          {quiz.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {quiz.description || 'Test your factual knowledge and understanding of authentic Indian heritage elements.'}
        </p>

        {userScore && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Highest Completed Score</span>
            </span>
            <span className="font-bold text-emerald-900 text-sm">
              {userScore.score}/{userScore.totalQuestions} ({userScore.percentage}%)
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-cream-200">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{quiz.timeLimit} Minutes</span>
          </span>
          <span className="flex items-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{quiz.questionsCount || quiz.questions?.length || 5} Questions</span>
          </span>
        </div>

        <button
          onClick={() => onStartQuiz(quiz._id)}
          className="w-full py-2.5 px-4 rounded-xl bg-royal-950 hover:bg-saffron-600 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 group-hover:shadow"
        >
          <Award className="w-4 h-4" />
          <span>{userScore ? 'Retake Assessment' : 'Start Assessment'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
