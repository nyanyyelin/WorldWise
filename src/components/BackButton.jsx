import Button from "./Button";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault(); // to avoid submiting the form.
        navigate(-1); // goes back to previous link
      }}
    >
      &larr; Back
    </Button>
  );
};
