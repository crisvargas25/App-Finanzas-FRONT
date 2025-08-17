import { Button } from "../../ui/button";
import {Text} from "../../ui/text";

interface LinkButtonProps {
    children?: React.ReactNode;
    text?: string;
    }

function LinkButton({ text }: LinkButtonProps) {
  return (
    <Button variant="link" action="primary" >
        <Text size="smButton" type="navyBlueText">{text}</Text>
      </Button>
  );
}

export default LinkButton;