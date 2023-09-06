import React, { useState, useEffect } from "react";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("http://localhost:4000/questions");
      const data = await response.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = {
      prompt: event.target.prompt.value,
      answers: event.target.answers.value.split("\n"),
      correctIndex: event.target.correctIndex.value,
    };
  
    console.log("Form data:", formData);
  
    const response = await fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    const newQuestion = await response.json();
  
    console.log("New question:", newQuestion);
  
    setQuestions([...questions, newQuestion]);
  };
  
  const handleDelete = async (id) => {
    console.log("Deleting question with ID:", id);
  
    await fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    });
  
    console.log("Question deleted.");
  
    setQuestions(questions.filter((question) => question.id !== id));
  };
  

  const handleUpdateCorrectAnswer = async (id, correctIndex) => {
    await fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex }),
    });

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id === id) {
          return { ...question, correctIndex };
        }
        return question;
      })
    );
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Prompt:</label>
        <input type="text" id="prompt" name="prompt" />

        <label htmlFor="answers">Answers (one per line):</label>
        <textarea id="answers" name="answers" />

        <label htmlFor="correctIndex">Correct Answer Index:</label>
        <input type="number" id="correctIndex" name="correctIndex" />

        <button type="submit">Add Question</button>
      </form>

      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.prompt}

            <button onClick={() => handleDelete(question.id)}>Delete</button>

            <select
              value={question.correctIndex}
              onChange={(e) =>
                handleUpdateCorrectAnswer(question.id, parseInt(e.target.value))
              }
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index}>
                  {answer}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
