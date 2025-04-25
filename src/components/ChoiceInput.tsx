export interface Choice {
  id: number;
  name: string;
  price: string;
  description?: string;
}
export interface ChoiceInputProps {
  choice: Choice;
  index: number;
  setSelectedChoice: Function;
  selectedChoice: number;
}
const ChoiceInput = ({
  choice,
  index,
  setSelectedChoice,
  selectedChoice,
}: ChoiceInputProps) => {
  return (
    <div
      key={index}
      onClick={() => setSelectedChoice(choice.id)}
      className={`choice ${choice.id === selectedChoice ? " active" : ""} ${choice.description ? "with-description" : ""}`}
    >
      {!choice.description ? (
        <div>
          <span>{choice.name}</span>
        </div>
      ) : (
        <div className="container-desc">
          <span>{choice.name}</span>
          <span id="small-description">{choice.description}</span>
        </div>
      )}
      <div className={`chip ${choice.price.toLowerCase()}`}>{choice.price}</div>
    </div>
  );
};
export default ChoiceInput;
