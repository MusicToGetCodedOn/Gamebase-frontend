import './LoadMoreButton.css';

function LoadMoreButton({ onClick, loading, hasMore }) {
  if (!hasMore) return null;

  return (
    <div className="load-more-container">
      <button
        className="load-more-button"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More Games"}
      </button>
    </div>
  );
}

export default LoadMoreButton;
