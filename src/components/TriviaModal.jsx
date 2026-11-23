import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function TriviaModal() {
  const phase = useGameStore((s) => s.phase);
  const activeQuestion = useGameStore((s) => s.activeQuestion);
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const lastResult = useGameStore((s) => s.lastResult);
  const triviaEndsAt = useGameStore((s) => s.triviaEndsAt);
  const isSubmitting = useGameStore((s) => s.isSubmitting);
  const submitAnswer = useGameStore((s) => s.submitAnswer);

  const [secondsLeft, setSecondsLeft] = useState(20);

  useEffect(() => {
    if (phase !== 'TRIVIA' || !triviaEndsAt) return;
    const update = () => {
      setSecondsLeft(Math.max(0, Math.ceil((triviaEndsAt - Date.now()) / 1000)));
    };
    update();
    const id = setInterval(update, 200);
    return () => clearInterval(id);
  }, [phase, triviaEndsAt]);

  // Atajos de teclado 1-4 para responder rápidamente
  useEffect(() => {
    if (phase !== 'TRIVIA' || !activeQuestion || isSubmitting) return;
    const onKeyDown = (e) => {
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx !== -1 && idx < activeQuestion.options.length) {
        submitAnswer(idx);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, activeQuestion, isSubmitting, submitAnswer]);

  if ((phase !== 'TRIVIA' && phase !== 'RESULT') || !activeQuestion) {
    return null;
  }

  return (
    <div className="trivia-overlay">
      <div className="trivia-card">
        <div className="trivia-header">
          <div className="captain-badge">
            <span className="captain-avatar">👨‍✈️</span>
            <div>
              <strong>Capitán del Tren</strong>
              <span className="category-tag">
                {activeQuestion.category} • {activeQuestion.difficulty || 'Media'}
              </span>
            </div>
          </div>

          {phase === 'TRIVIA' && (
            <span className={`timer-pill ${secondsLeft <= 5 ? 'urgent' : ''}`}>
              ⏱️ {secondsLeft}s
            </span>
          )}
        </div>

        <h2 className="trivia-question">{activeQuestion.question}</h2>

        <div className="options-grid">
          {activeQuestion.options.map((option, idx) => {
            let statusClass = '';
            if (lastResult) {
              if (idx === lastResult.correctIndex) {
                statusClass = 'correct';
              } else if (idx === selectedIndex && !lastResult.correct) {
                statusClass = 'wrong';
              }
            }

            return (
              <button
                key={idx}
                className={`option-btn ${statusClass}`}
                disabled={phase !== 'TRIVIA' || isSubmitting}
                onClick={() => submitAnswer(idx)}
              >
                <span className="option-letter">{LETTERS[idx]}</span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {lastResult && (
          <div className={`result-banner ${lastResult.correct ? 'success' : 'error'}`}>
            {lastResult.correct ? (
              <>
                <strong>¡Respuesta correcta! +{lastResult.totalEarned} 🪙</strong>
                <span>
                  ({lastResult.baseCoins} base
                  {lastResult.streakBonus > 0 ? ` + ${lastResult.streakBonus} racha` : ''}
                  {lastResult.passiveIncome > 0 ? ` + ${lastResult.passiveIncome} locales` : ''})
                  — ¡Pasajeros bajando al andén!
                </span>
              </>
            ) : (
              <>
                <strong>
                  {lastResult.timedOut ? '¡Se acabó el tiempo!' : 'Respuesta incorrecta'}
                  {lastResult.passiveIncome > 0 ? ` (+${lastResult.passiveIncome} 🪙 locales)` : ''}
                </strong>
                <span>La racha volvió a 0. ¡Prepárate para el próximo tren!</span>
              </>
            )}
            {lastResult.explanation && (
              <span className="explanation-text">💡 {lastResult.explanation}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
