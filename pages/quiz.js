import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from '../src/components/Button';
import QuizBackground from '../src/components/QuizBackground';
import QuizLogo from '../src/components/QuizLogo';
import QuizContainer from '../src/components/QuizContainer';
import { Widget } from '../src/components/Widget';
import db from '../db.json';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
        |Desafio do Loading|
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question, totalQuestions, questionIndex, onSubmit,
}) {
  const questionId = `question__${questionIndex}`;
  return (
    <Widget>
      <Widget.Header>
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: 150,
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          {question.alternatives
            .map((alternative, alternativeIndex) => {
              const alternativeId = `alternative__${alternativeIndex}`;
              return (
                <Widget.Topic
                  as="label"
                  htmlFor={alternativeId}
                  key={alternativeId}
                >
                  <input
                    // style={{ display: 'none' }}
                    name={questionId}
                    id={alternativeId}
                    type="radio"
                  />
                  {alternative}
                </Widget.Topic>
              );
            })}
          <Button type="submit">Confirmar</Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

QuestionWidget.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  question: PropTypes.shape({
    alternatives: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  questionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

function QuizPage() {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [questionIndex, setQuestionIndex] = useState(0);
  const totalQuestions = db.questions.length;
  const question = db.questions[questionIndex];

  const handleSubmit = () => {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setQuestionIndex(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 2000);
  }, []);

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmit}
          />
        )}
        {screenState === screenStates.LOADING && (
          <LoadingWidget />
        )}
        {screenState === screenStates.RESULT && (
          <div>Você acertou X questões, parabéns!!</div>
        )}
      </QuizContainer>
    </QuizBackground>
  );
}

export default QuizPage;
