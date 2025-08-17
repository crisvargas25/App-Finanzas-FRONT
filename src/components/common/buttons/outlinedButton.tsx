import { Button } from "../../ui/button";
import {Text} from "../../ui/text";

interface OutlinedButtonProps {
    children?: React.ReactNode;
    text?: string;
    }

function OutlinedButton({ text }: OutlinedButtonProps) {
  return (
    <Button variant="outlined" action="primary" >
          <Text size="smButton" type="navyBlueText">{text}</Text>
        </Button>
  );
}

export default OutlinedButton;