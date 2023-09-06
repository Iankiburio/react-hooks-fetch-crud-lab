import React, { useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const [page, setPage] = useState("List");

  return (
    <main>
      <ErrorBoundary>
        <AdminNavBar onChangePage={setPage} />
      </ErrorBoundary>
      <ErrorBoundary>
        {page === "Form" ? <QuestionForm /> : <QuestionList />}
      </ErrorBoundary>
    </main>
  );
}

export default App;
