const Loader = ({ text }: { text: string }) => {
  return (
    <div className="loading-container">
      <div className="loader" />
      <h2>{text}</h2>
    </div>
  );
};

export default Loader;
